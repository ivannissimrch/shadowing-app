import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY not defined - ESL coach will not work");
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
const MODEL_NAME = "gemini-2.0-flash";

interface PhonemeResult {
  phoneme: string;
  accuracyScore: number;
}

interface WordResult {
  word: string;
  accuracyScore: number;
  errorType: string;
  phonemes: PhonemeResult[];
}

interface EvaluationResult {
  text: string;
  accuracyScore: number;
  fluencyScore: number;
  completenessScore: number;
  pronunciationScore: number;
  words: WordResult[];
}

export async function getCoachFeedback(
  referenceText: string,
  evaluation: EvaluationResult,
  nativeLanguage?: string | null,
): Promise<string> {
  if (!genAI) {
    throw new Error("Gemini API key not configured");
  }

  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  let prompt: string;

  if (nativeLanguage) {
    prompt = `You are an ESL pronunciation coach. The student's first language is ${nativeLanguage}.

They tried to say: "${referenceText}"

Azure pronunciation assessment results:
${JSON.stringify(evaluation, null, 2)}

Based on these scores, do the following:
1. Identify the single lowest-scoring phoneme. Focus ONLY on that one sound.
2. Explain specifically why a ${nativeLanguage} speaker is likely making this error in this word. Consider how sounds in ${nativeLanguage} interfere with this English sound, and how the surrounding letters in this word affect pronunciation.
3. Give one concrete, actionable tip to fix it in THIS specific word. Do not suggest practicing with other words.
4. Keep your response to 2-3 sentences max.

Do not use any markdown formatting. Write in plain text only.`;
  } else {
    prompt = `You are an ESL pronunciation coach.

The student tried to say: "${referenceText}"

Azure pronunciation assessment results:
${JSON.stringify(evaluation, null, 2)}

Based on these scores, do the following:
1. Identify the single lowest-scoring phoneme. Focus ONLY on that one sound.
2. Explain what the student is likely doing wrong with this sound.
3. Give one concrete, actionable tip to fix it in THIS specific word. Do not suggest practicing with other words.
4. Keep your response to 2-3 sentences max.

Do not use any markdown formatting. Write in plain text only.`;
  }

  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
}
