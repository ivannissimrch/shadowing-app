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

// Detect actual audio format from magic bytes — MIME type labels from browsers
// (especially iOS in-app browsers) are unreliable. iOS records as MP4 but may
// label the blob as audio/wav. Reading the raw bytes is the only reliable method.
function detectAudioFormat(buffer: Buffer): string {
  if (buffer.length < 8) return "webm";

  // MP4/ISOBMFF: bytes 4-7 are 'ftyp'
  if (
    buffer[4] === 0x66 && buffer[5] === 0x74 &&
    buffer[6] === 0x79 && buffer[7] === 0x70
  ) return "mp4";

  // MP4 live recording (Safari MediaRecorder): first box is 'mdat' instead of 'ftyp'
  if (
    buffer[4] === 0x6d && buffer[5] === 0x64 &&
    buffer[6] === 0x61 && buffer[7] === 0x74
  ) return "mp4";

  // WebM: starts with EBML header 0x1A 0x45 0xDF 0xA3
  if (
    buffer[0] === 0x1a && buffer[1] === 0x45 &&
    buffer[2] === 0xdf && buffer[3] === 0xa3
  ) return "webm";

  // WAV: starts with 'RIFF'
  if (
    buffer[0] === 0x52 && buffer[1] === 0x49 &&
    buffer[2] === 0x46 && buffer[3] === 0x46
  ) return "wav";

  // OGG: starts with 'OggS'
  if (
    buffer[0] === 0x4f && buffer[1] === 0x67 &&
    buffer[2] === 0x67 && buffer[3] === 0x53
  ) return "ogg";

  return "webm"; // fallback
}

// Convert audio buffer to WAV buffer (normalised to 16kHz mono PCM for Azure)
function convertToWav(inputBuffer: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const format = detectAudioFormat(inputBuffer);
    const inputStream = Readable.from(inputBuffer);
    const outputStream = new PassThrough();
    const chunks: Buffer[] = [];

    outputStream.on("data", (chunk) => chunks.push(chunk));
    outputStream.on("end", () => resolve(Buffer.concat(chunks)));
    outputStream.on("error", reject);

    ffmpeg(inputStream)
      .inputFormat(format)
      .audioFrequency(16000)
      .audioChannels(1)
      .audioCodec("pcm_s16le")
      .format("wav")
      .on("stderr", (line) => {
        console.error(`[ffmpeg stderr] (detected format: ${format})`, line);
      })
      .on("error", (err) => {
        console.error(`[ffmpeg error] input format: ${format} —`, err.message);
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
  // Log original audio details for debugging iPhone issues
  const originalFormat = detectAudioFormat(audioBuffer);
  console.log(`[DEBUG] Audio evaluation - Original: ${audioBuffer.length} bytes, format: ${originalFormat}`);

  // Convert webm to WAV for Azure
  const wavBuffer = await convertToWav(audioBuffer);
  console.log(`[DEBUG] Audio evaluation - Converted WAV: ${wavBuffer.length} bytes`);

  // Log potential issues with short audio
  if (wavBuffer.length < 8000) { // Less than ~0.25 seconds of 16kHz mono PCM
    console.warn(`[WARNING] Very short audio detected: ${wavBuffer.length} bytes - may cause evaluation issues`);
  }

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

          // Log evaluation results for debugging
          console.log(`[DEBUG] Azure evaluation successful - Text: "${result.text}", Accuracy: ${pronunciationResult.accuracyScore}, Reference: "${referenceText}"`);

          // Check if recognized text is suspiciously short compared to reference
          if (result.text.length < referenceText.length * 0.3) {
            console.warn(`[WARNING] Recognized text much shorter than reference - may indicate partial audio. Got: "${result.text}", Expected: "${referenceText}"`);
          }

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
