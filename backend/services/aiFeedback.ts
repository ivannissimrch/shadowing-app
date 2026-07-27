import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const geminiApiKey = process.env.GEMINI_API_KEY!;

if (!geminiApiKey) {
  throw new Error("GEMINI_API_KEY not defined");
}

const ai = new GoogleGenAI({ apiKey: geminiApiKey });

// Shape of the Azure pronunciation stats we feed to Gemini.
export interface PronunciationStats {
  text: string; // what Azure actually heard
  referenceText: string; // what the student was supposed to say
  accuracyScore: number;
  fluencyScore: number;
  completenessScore: number;
  pronunciationScore: number;
  words: {
    word: string;
    accuracyScore?: number;
    errorType?: string;
    phonemes?: { phoneme: string; accuracyScore?: number }[];
  }[];
}

// Turn raw Azure pronunciation scores into a warm, ready-to-send draft the
// teacher can edit. Returns plain text (no markdown, no preamble).
export async function generateFeedbackDraft(
  stats: PronunciationStats,
  teacherInstruction?: string
): Promise<string> {
  // Build a grounded breakdown of the weakest words AND the specific sounds
  // (phonemes) inside them that scored low. This is what lets the feedback name
  // the real problem sound instead of guessing.
  const weakWords = [...stats.words]
    .filter((w) => typeof w.accuracyScore === "number" && (w.accuracyScore ?? 100) < 75)
    .sort((a, b) => (a.accuracyScore ?? 100) - (b.accuracyScore ?? 100))
    .slice(0, 3)
    .map((w) => {
      const weakPhonemes = (w.phonemes ?? [])
        .filter((p) => typeof p.accuracyScore === "number")
        .sort((a, b) => (a.accuracyScore ?? 100) - (b.accuracyScore ?? 100))
        .slice(0, 2)
        .map((p) => `"${p.phoneme}" sound scored ${Math.round(p.accuracyScore ?? 0)}/100`)
        .join("; ");
      const err =
        w.errorType && w.errorType !== "None" ? ` (${w.errorType})` : "";
      return `- "${w.word}"${err}, overall ${Math.round(
        w.accuracyScore ?? 0
      )}/100. Weakest sounds: ${weakPhonemes || "no phoneme detail"}`;
    })
    .join("\n");

  // Same idea for praise: without real data here, Gemini has nothing to
  // ground "praise something specific" in and ends up inventing plausible-
  // sounding compliments about words it never actually saw a score for.
  // Short function words (a, is, it, do...) make weak praise targets even
  // when they score well, so require some real length.
  const strongWordsSeen = new Set<string>();
  const strongWords = [...stats.words]
    .filter(
      (w) =>
        typeof w.accuracyScore === "number" &&
        (w.accuracyScore ?? 0) >= 90 &&
        w.word.length > 3
    )
    .sort((a, b) => (b.accuracyScore ?? 0) - (a.accuracyScore ?? 0))
    .filter((w) => {
      const key = w.word.toLowerCase();
      if (strongWordsSeen.has(key)) return false;
      strongWordsSeen.add(key);
      return true;
    })
    .slice(0, 3)
    .map((w) => `- "${w.word}", scored ${Math.round(w.accuracyScore ?? 0)}/100`)
    .join("\n");

  const prompt = `You are helping an ESL (English as a Second Language) teacher write short, encouraging feedback for a student who just submitted a spoken lesson.

The student read this reference text:
"${stats.referenceText}"

The speech engine flagged these words the student pronounced especially well (0-100, higher = better). Use ONE of these, by name, for the praise — never praise a word's pronunciation that isn't listed here:
${strongWords || "No standout words detected — keep the opening encouraging but general, don't name a specific word."}

The speech engine flagged these specific words and the exact SOUNDS inside them that the student mispronounced (0-100, lower = worse). The sounds are written in ARPAbet phonetic codes — translate them to how a learner would understand them (e.g. "dh" = the voiced "th" as in "this", "th" = the soft "th" as in "think", "f" = the "f" sound, "r" = the "r" sound, "ae" = the short "a" as in "cat", "iy" = the long "ee", "l" = the "l" sound):
${weakWords || "No specific problem sounds detected — the student pronounced everything well."}
${
  teacherInstruction?.trim()
    ? `\nThe teacher gave you this instruction — prioritize it over the defaults below: "${teacherInstruction.trim()}"\n`
    : ""
}
Write a warm, personal note directly to the student (2-4 sentences):
- Start by praising something specific they did well — the word you name must come from the well-pronounced list above.
- Then focus on the SINGLE most important sound to fix. Name the exact word it appeared in, describe the specific sound in plain English (NOT the phonetic code), and say where in the word it is. Give one tiny, concrete tip for making that sound.
- End with encouragement.

Rules:
- Be specific about the sound — the teacher must know exactly which sound you mean. Never say a vague "th sound" without anchoring it to the exact word.
- Do NOT praise, name, or make claims about any word that isn't explicitly listed above — if you have nothing grounded to praise, stay general instead of inventing a specific example.
- Do NOT mention the speech engine, scores, numbers, or phonetic codes. Speak like a caring human teacher.
- No jargon. No markdown. No greeting line like "Dear student".
- Output ONLY the message text, nothing else.`;

  const response = await generateWithRetry(prompt);

  const draft = response.text?.trim();

  if (!draft) {
    throw new Error("Gemini returned an empty feedback draft");
  }

  return draft;
}

// Gemini returns transient 503 (UNAVAILABLE) / 429 when a model is overloaded.
// Retry a few times with exponential backoff so teachers never see the blip.
async function generateWithRetry(prompt: string, maxAttempts = 3) {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await ai.models.generateContent({
        // Stable alias that tracks Google's current flash model, so a version
        // deprecation (e.g. 2.5-flash being pulled) won't 404 us again.
        model: "gemini-flash-latest",
        contents: prompt,
      });
    } catch (err) {
      lastError = err;
      const message = err instanceof Error ? err.message : String(err);
      const isTransient = /503|429|UNAVAILABLE|overloaded|high demand/i.test(
        message
      );

      if (!isTransient || attempt === maxAttempts) {
        throw err;
      }

      const backoffMs = 500 * 2 ** (attempt - 1); // 500ms, 1s, 2s
      console.warn(
        `[aiFeedback] Gemini transient error (attempt ${attempt}/${maxAttempts}), retrying in ${backoffMs}ms`
      );
      await new Promise((resolve) => setTimeout(resolve, backoffMs));
    }
  }

  throw lastError;
}
