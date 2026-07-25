import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import * as dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { convertToWav } from "./speechEvaluation.js";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const speechKey = process.env.AZURE_SPEECH_KEY!;
const speechRegion = process.env.AZURE_SPEECH_REGION!;
const geminiApiKey = process.env.GEMINI_API_KEY!;

if (!speechKey || !speechRegion) {
  throw new Error("AZURE_SPEECH_KEY or AZURE_SPEECH_REGION not defined");
}
if (!geminiApiKey) {
  throw new Error("GEMINI_API_KEY not defined");
}

const genAI = new GoogleGenAI({ apiKey: geminiApiKey });
const TICKS_PER_SECOND = 10_000_000;

export interface TimedWord {
  word: string;
  startTime: number;
  endTime: number;
}

export interface SuggestedSegment {
  label: string;
  start_time: number;
  end_time: number;
  position: number;
}

// Full-lesson transcription with per-word timestamps. recognizeOnceAsync (used
// for pronunciation scoring elsewhere) stops after one utterance, so a whole
// lesson track needs continuous recognition instead.
export async function transcribeWithTimestamps(
  audioBuffer: Buffer
): Promise<TimedWord[]> {
  const wavBuffer = await convertToWav(audioBuffer);

  const speechConfig = sdk.SpeechConfig.fromSubscription(
    speechKey,
    speechRegion
  );
  speechConfig.speechRecognitionLanguage = "en-US";
  speechConfig.requestWordLevelTimestamps();
  speechConfig.outputFormat = sdk.OutputFormat.Detailed;

  const pushStream = sdk.AudioInputStream.createPushStream();
  const arrayBuffer = new Uint8Array(wavBuffer).buffer as ArrayBuffer;
  pushStream.write(arrayBuffer);
  pushStream.close();

  const audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
  const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

  const words: TimedWord[] = [];

  return new Promise((resolve, reject) => {
    recognizer.recognized = (_sender, event) => {
      if (event.result.reason !== sdk.ResultReason.RecognizedSpeech) return;

      const json = event.result.properties.getProperty(
        sdk.PropertyId.SpeechServiceResponse_JsonResult
      );
      if (!json) return;

      const best = JSON.parse(json).NBest?.[0];
      if (!best?.Words) return;

      for (const w of best.Words as {
        Word: string;
        Offset: number;
        Duration: number;
      }[]) {
        words.push({
          word: w.Word,
          startTime: w.Offset / TICKS_PER_SECOND,
          endTime: (w.Offset + w.Duration) / TICKS_PER_SECOND,
        });
      }
    };

    recognizer.canceled = (_sender, event) => {
      recognizer.close();
      if (event.reason === sdk.CancellationReason.Error) {
        reject(new Error(event.errorDetails || "Transcription failed"));
      } else {
        resolve(words);
      }
    };

    recognizer.sessionStopped = () => {
      recognizer.stopContinuousRecognitionAsync(
        () => {
          recognizer.close();
          resolve(words);
        },
        (err) => {
          recognizer.close();
          reject(new Error(err));
        }
      );
    };

    recognizer.startContinuousRecognitionAsync(undefined, (err) =>
      reject(new Error(err))
    );
  });
}

// Asks Gemini to group a timed transcript into natural shadowing-length
// phrases. The model only ever picks word INDICES, never timestamps — the
// real start/end times are read back from Azure's word timings, so a
// hallucinated float can't corrupt a segment boundary.
export async function segmentWithGemini(
  words: TimedWord[]
): Promise<SuggestedSegment[]> {
  if (words.length === 0) {
    throw new Error("No speech detected in lesson audio.");
  }

  const indexedTranscript = words.map((w, i) => `${i}:${w.word}`).join(" ");

  const prompt = `You are helping an ESL teacher split a lesson transcript into short phrases for shadowing practice (students repeat one phrase at a time after the audio pauses).

The transcript below is a sequence of words, each prefixed by its index: "index:word".

${indexedTranscript}

Group the words into natural phrase-level segments (roughly 4-12 words each), breaking at clause or sentence boundaries so each segment is something a student could repeat as one natural chunk. Do not skip or reorder any words; every word index from 0 to ${
    words.length - 1
  } must belong to exactly one segment, in order.

Return ONLY a JSON array, no other text, in this exact shape:
[{"startIndex": 0, "endIndex": 5, "label": "the exact words of this segment"}]`;

  const response = await genAI.models.generateContent({
    // "-latest" alias so this keeps working as Google retires dated model
    // versions (gemini-2.5-flash itself was cut off from new API keys).
    model: "gemini-flash-latest",
    contents: prompt,
    config: { responseMimeType: "application/json" },
  });

  const text = response.text;
  if (!text) {
    throw new Error("AI segmentation returned an empty response.");
  }

  let parsed: { startIndex: number; endIndex: number; label: string }[];
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("AI segmentation returned an unreadable response.");
  }

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("AI segmentation returned no segments.");
  }

  const suggestions = parsed
    .filter(
      (s) =>
        Number.isInteger(s.startIndex) &&
        Number.isInteger(s.endIndex) &&
        s.startIndex >= 0 &&
        s.endIndex < words.length &&
        s.startIndex <= s.endIndex
    )
    .sort((a, b) => a.startIndex - b.startIndex)
    .map((s, i) => ({
      label:
        s.label?.trim() ||
        words
          .slice(s.startIndex, s.endIndex + 1)
          .map((w) => w.word)
          .join(" "),
      start_time: Math.round(words[s.startIndex].startTime * 100) / 100,
      end_time: Math.round(words[s.endIndex].endTime * 100) / 100,
      position: i + 1,
    }));

  if (suggestions.length === 0) {
    throw new Error("AI segmentation returned no valid segments.");
  }

  return suggestions;
}

export async function autoSegmentLesson(
  audioBuffer: Buffer
): Promise<SuggestedSegment[]> {
  const words = await transcribeWithTimestamps(audioBuffer);
  return segmentWithGemini(words);
}
