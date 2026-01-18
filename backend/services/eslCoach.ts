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
): Promise<string> {
  if (!genAI) {
    throw new Error("Gemini API key not configured");
  }

  const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  const prompt = `Student tried to say: "${referenceText}"
  Azure pronunciation assessment:
  ${JSON.stringify(evaluation, null, 2)}
  You are an ESL coach. Provide feedback to help the student improve their pronunciation.\
  Focus ONLY on sounds with low scores. Explain what am i doing wrong and how to improve my pronunciation. Be concise and assertive.`;
  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
}
