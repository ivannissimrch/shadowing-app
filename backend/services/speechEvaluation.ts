import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import * as dotenv from "dotenv";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";
import { Readable, PassThrough } from "stream";

ffmpeg.setFfmpegPath(ffmpegPath.path);

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const speechKey = process.env.AZURE_SPEECH_KEY!;
const speechRegion = process.env.AZURE_SPEECH_REGION!;

if (!speechKey || !speechRegion) {
  throw new Error("AZURE_SPEECH_KEY or AZURE_SPEECH_REGION not defined");
}

// Convert webm buffer to WAV buffer
function convertToWav(inputBuffer: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const inputStream = Readable.from(inputBuffer);
    const outputStream = new PassThrough();
    const chunks: Buffer[] = [];

    outputStream.on("data", (chunk) => chunks.push(chunk));
    outputStream.on("end", () => resolve(Buffer.concat(chunks)));
    outputStream.on("error", reject);

    ffmpeg(inputStream)
      .inputFormat("webm")
      .audioFrequency(16000)
      .audioChannels(1)
      .audioCodec("pcm_s16le")
      .format("wav")
      .on("error", () => {
        reject(new Error("Failed to process audio. The recording may be empty or corrupted."));
      })
      .pipe(outputStream);
  });
}

// Text-to-Speech using Azure Neural Voice
export async function synthesizeSpeech(
  text: string,
  rate: number = 1.0
): Promise<Buffer> {
  const speechConfig = sdk.SpeechConfig.fromSubscription(speechKey, speechRegion);

  // Use a natural-sounding neural voice
  speechConfig.speechSynthesisVoiceName = "en-US-AriaNeural";

  // Create synthesizer (null audio config = returns audio data instead of playing)
  const synthesizer = new sdk.SpeechSynthesizer(speechConfig, undefined);

  // Use SSML to control speech rate
  const ssml = `
    <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
      <voice name="en-US-JennyNeural">
        <prosody rate="${rate}">${text}</prosody>
      </voice>
    </speak>
  `;

  return new Promise((resolve, reject) => {
    synthesizer.speakSsmlAsync(
      ssml,
      (result) => {
        synthesizer.close();
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          resolve(Buffer.from(result.audioData));
        } else {
          reject(new Error(`Speech synthesis failed: ${result.errorDetails}`));
        }
      },
      (error) => {
        synthesizer.close();
        reject(error);
      }
    );
  });
}

export async function evaluatePronunciation(
  audioBuffer: Buffer,
  referenceText: string
) {
  // Convert webm to WAV for Azure
  const wavBuffer = await convertToWav(audioBuffer);
  const speechConfig = sdk.SpeechConfig.fromSubscription(speechKey, speechRegion);
  speechConfig.speechRecognitionLanguage = "en-US";

  const pronunciationConfig = new sdk.PronunciationAssessmentConfig(
    referenceText,
    sdk.PronunciationAssessmentGradingSystem.HundredMark,
    sdk.PronunciationAssessmentGranularity.Phoneme,
    true
  );

  const pushStream = sdk.AudioInputStream.createPushStream();
  const arrayBuffer = new Uint8Array(wavBuffer).buffer as ArrayBuffer;
  pushStream.write(arrayBuffer);
  pushStream.close();

  const audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
  const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

  pronunciationConfig.applyTo(recognizer);

  return new Promise((resolve, reject) => {
    recognizer.recognizeOnceAsync(
      (result) => {
        if (result.reason === sdk.ResultReason.RecognizedSpeech) {
          const pronunciationResult =
            sdk.PronunciationAssessmentResult.fromResult(result);

          resolve({
            text: result.text,
            accuracyScore: pronunciationResult.accuracyScore,
            fluencyScore: pronunciationResult.fluencyScore,
            completenessScore: pronunciationResult.completenessScore,
            pronunciationScore: pronunciationResult.pronunciationScore,
            words: pronunciationResult.detailResult.Words.map((word: any) => ({
              word: word.Word,
              accuracyScore: word.PronunciationAssessment?.AccuracyScore,
              errorType: word.PronunciationAssessment?.ErrorType,
              phonemes: word.Phonemes?.map((phoneme: any) => ({
                phoneme: phoneme.Phoneme,
                accuracyScore: phoneme.PronunciationAssessment?.AccuracyScore,
              })),
            })),
          });
        } else if (result.reason === sdk.ResultReason.NoMatch) {
          reject(new Error("No speech detected. Please check your microphone is working and try again."));
        } else {
          const errorMessage = result.errorDetails || "No speech detected. Please check your microphone and try again.";
          reject(new Error(errorMessage));
        }
        recognizer.close();
      },
      (error) => {
        recognizer.close();
        reject(error);
      }
    );
  });
}
