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

  // MP3: ID3v2 tag ('ID3') or a raw MPEG audio frame sync (0xFF + 11 set sync bits).
  // Server-extracted lesson audio (audioExtraction.ts, libmp3lame) is MP3 and
  // never comes from a browser recorder, so this can't collide with the blob
  // formats above.
  if (
    buffer[0] === 0x49 && buffer[1] === 0x44 && buffer[2] === 0x33
  ) return "mp3";
  if (buffer[0] === 0xff && (buffer[1] & 0xe0) === 0xe0) return "mp3";

  return "webm"; // fallback
}

// Convert audio buffer to WAV buffer (normalised to 16kHz mono PCM for Azure)
export function convertToWav(inputBuffer: Buffer): Promise<Buffer> {
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

// Plain speech-to-text for a lesson's own narration audio (no reference text
// involved). Uses continuous recognition, not recognizeOnceAsync, because a
// lesson's audio is typically many sentences long and recognizeOnceAsync stops
// at the first pause — that would silently truncate the transcript to just the
// opening line.
export async function transcribeAudio(audioBuffer: Buffer): Promise<string> {
  const wavBuffer = await convertToWav(audioBuffer);

  const speechConfig = sdk.SpeechConfig.fromSubscription(speechKey, speechRegion);
  speechConfig.speechRecognitionLanguage = "en-US";
  // These clips are TV dialogue, not clean ESL narration — Azure's default
  // profanity filter masks swear words as "****" in the transcript, which then
  // gets cached as verified_transcript and permanently corrupts that reference
  // text. Keep the actual words so scoring has something real to align to.
  speechConfig.setProfanity(sdk.ProfanityOption.Raw);

  const pushStream = sdk.AudioInputStream.createPushStream();
  const arrayBuffer = new Uint8Array(wavBuffer).buffer as ArrayBuffer;
  pushStream.write(arrayBuffer);
  pushStream.close();

  const audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
  const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

  const chunks: string[] = [];

  return new Promise((resolve, reject) => {
    recognizer.recognized = (_sender, event) => {
      if (event.result.reason === sdk.ResultReason.RecognizedSpeech && event.result.text) {
        chunks.push(event.result.text);
      }
    };

    recognizer.canceled = (_sender, event) => {
      recognizer.stopContinuousRecognitionAsync(() => recognizer.close());
      if (event.reason === sdk.CancellationReason.Error) {
        reject(new Error(`Transcription failed: ${event.errorDetails}`));
      } else {
        resolve(chunks.join(" "));
      }
    };

    recognizer.sessionStopped = () => {
      recognizer.stopContinuousRecognitionAsync(() => {
        recognizer.close();
        resolve(chunks.join(" "));
      });
    };

    recognizer.startContinuousRecognitionAsync(undefined, (error) => {
      recognizer.close();
      reject(error);
    });
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
  speechConfig.setProfanity(sdk.ProfanityOption.Raw);

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

  // recognizeOnceAsync only scores the first utterance (stops at the first
  // pause) — on a 60s recording that silently drops everything the student
  // said afterward, and the missing words come back as false "Omission"
  // errors instead of real scores. Continuous recognition walks the whole
  // recording, firing one `recognized` event per utterance; accumulate them
  // all before resolving.
  const textChunks: string[] = [];
  const words: {
    word: string;
    accuracyScore: number | undefined;
    errorType: string | undefined;
    phonemes: { phoneme: string; accuracyScore: number | undefined }[] | undefined;
  }[] = [];
  let durationSum = 0;
  let accuracySum = 0;
  let fluencySum = 0;
  let pronunciationSum = 0;

  console.log(`[DEBUG] Starting continuous recognition (${wavBuffer.length} byte WAV) — this runs roughly in step with the recording's length, expect it to take a while on longer audio.`);

  return new Promise((resolve, reject) => {
    let settled = false;
    let inactivityTimer: ReturnType<typeof setTimeout>;

    // Closing the push stream doesn't reliably trigger `sessionStopped` even
    // after every utterance has been recognized and scored correctly — a
    // known flakiness with continuous recognition on push streams, not a
    // live-mic scenario. Without a fallback this hangs the request forever.
    // Utterances land roughly every 8-10s on a normal recording, so give it
    // a generous 15s of true silence before deciding we're actually done.
    const scheduleFinish = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(finish, 15000);
    };

    const finish = () => {
      if (settled) return;
      settled = true;
      clearTimeout(inactivityTimer);

      recognizer.stopContinuousRecognitionAsync(() => {
        recognizer.close();

        if (words.length === 0) {
          reject(new Error("No speech detected. Please check your microphone is working and try again."));
          return;
        }

        const text = textChunks.join(" ");
        // completenessScore per utterance is scoped to whatever slice of the
        // reference Azure thinks that utterance covers — not meaningful once
        // stitched together. Recompute it globally instead: how many
        // reference words actually got a real score vs. total reference length.
        const referenceWordCount = referenceText.trim().split(/\s+/).filter(Boolean).length;
        const scoredWordCount = words.filter((w) => w.errorType !== "Omission").length;

        console.log(`[DEBUG] Azure evaluation successful - Text: "${text}", Reference: "${referenceText}"`);

        resolve({
          text,
          accuracyScore: durationSum ? accuracySum / durationSum : 0,
          fluencyScore: durationSum ? fluencySum / durationSum : 0,
          completenessScore: referenceWordCount
            ? Math.min(100, (scoredWordCount / referenceWordCount) * 100)
            : 0,
          pronunciationScore: durationSum ? pronunciationSum / durationSum : 0,
          words,
        });
      }, () => {
        recognizer.close();
        reject(new Error("Failed to stop pronunciation evaluation cleanly."));
      });
    };

    recognizer.recognized = (_sender, event) => {
      scheduleFinish();
      if (event.result.reason !== sdk.ResultReason.RecognizedSpeech) return;

      const utteranceResult = sdk.PronunciationAssessmentResult.fromResult(event.result);
      console.log(`[DEBUG] Utterance scored - "${event.result.text}" (accuracy: ${utteranceResult.accuracyScore})`);
      // Weight each utterance's contribution by its duration so a long,
      // well-scored stretch outweighs a short mumbled one, same principle
      // Azure's own multi-utterance samples use.
      const duration = event.result.duration || 1;

      textChunks.push(event.result.text);
      durationSum += duration;
      accuracySum += (utteranceResult.accuracyScore ?? 0) * duration;
      fluencySum += (utteranceResult.fluencyScore ?? 0) * duration;
      pronunciationSum += (utteranceResult.pronunciationScore ?? 0) * duration;

      words.push(
        ...utteranceResult.detailResult.Words.map((word: any) => ({
          word: word.Word,
          accuracyScore: word.PronunciationAssessment?.AccuracyScore,
          errorType: word.PronunciationAssessment?.ErrorType,
          phonemes: word.Phonemes?.map((phoneme: any) => ({
            phoneme: phoneme.Phoneme,
            accuracyScore: phoneme.PronunciationAssessment?.AccuracyScore,
          })),
        }))
      );
    };

    recognizer.canceled = (_sender, event) => {
      if (event.reason === sdk.CancellationReason.Error) {
        settled = true;
        clearTimeout(inactivityTimer);
        recognizer.stopContinuousRecognitionAsync(() => recognizer.close());
        reject(new Error(event.errorDetails || "Pronunciation evaluation failed."));
      } else {
        finish();
      }
    };

    recognizer.sessionStopped = () => {
      finish();
    };

    recognizer.startContinuousRecognitionAsync(() => {
      scheduleFinish();
    }, (error) => {
      recognizer.close();
      reject(error);
    });
  });
}
