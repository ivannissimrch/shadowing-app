import { Router } from "express";
import { db } from "./server.js";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import { DimensionKind } from "microsoft-cognitiveservices-speech-sdk/distrib/lib/src/common.speech/ServiceMessages/PronunciationScore/PronunciationAssessmentOptions.js";

//temporary text for pronunciation assessment until we have a proper lesson text from the database
const referenceText = `No, no. If he goes through with this, that company goes out of business. There's no way he kills his own company. You're right. He wouldn’t but I would. And as you pointed out, Keith's judgment has been impaired lately.`;

// So,
// I convinced him to let me make the decisions going forward. I now have power of attorney, and I'd rather see this company worth nothing than let you have it. This is bullshit. Let him finish. Something's coming. We have three choices here.
// We move forward with the suit. Lose lose. We can give you your money back plus the 500,000 or you and I can play poker for it. And I'm not giving you your money back. Harvey Specter has refused to take a mandatory drug test, leaving me no choice but to terminate his employment.
// As is his right, he's requested a hearing to dispute this. Thank you, Daniel. But I'm not here to dispute anything. After all, I was hiding. I was hiding because I was being forced to work for you.`;

const router = Router();

// Get all lessons for a user
router.get("/lessons", async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await db.query(
      "SELECT * FROM lessons WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching lessons:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Get specific user lesson
router.get("/lessons/:lessonId", async (req, res) => {
  try {
    const { lessonId } = req.params;
    const userId = req.user.id;

    const result = await db.query(
      "SELECT * FROM lessons WHERE user_id = $1 AND lesson_id = $2",
      [userId, lessonId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching lesson:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Update specific user lesson
router.patch("/lessons/:lessonId", async (req, res) => {
  try {
    const { audio_file } = req.body;
    const { lessonId } = req.params;
    const userId = req.user.id;

    const result = await db.query(
      `UPDATE lessons 
       SET audio_file = $1, status = 'completed', updated_at = CURRENT_TIMESTAMP 
       WHERE user_id = $2 AND lesson_id = $3 
       RETURNING *`,
      [audio_file, userId, lessonId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating lesson:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Add new lesson to user
router.post("/lessons", async (req, res) => {
  try {
    const userId = req.user.id;
    const { lessonId, audio_file, title, image, videoId } = req.body;

    // Check if the lesson already exists
    const existingLesson = await db.query(
      "SELECT id FROM lessons WHERE user_id = $1 AND lesson_id = $2",
      [userId, lessonId]
    );

    if (existingLesson.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Lesson already exists",
      });
    }

    // Add new lesson
    const result = await db.query(
      `INSERT INTO lessons (user_id, lesson_id, title, image, video_id, audio_file, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'new')
       RETURNING *`,
      [userId, lessonId, title, image, videoId, audio_file || ""]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error adding lesson:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Evaluate pronunciation of an audio file against a reference text using Azure Speech Service
router.post("/evaluate-pronunciation", async (req, res) => {
  console.log("Received request to evaluate pronunciation");
  let tempFilePath = null;

  try {
    const { audio_file, language = "en-US" } = req.body;

    if (!audio_file || !referenceText) {
      return res.status(400).json({
        success: false,
        message: "audio_file (base64) and referenceText are required",
      });
    }

    if (!process.env.AZURE_SPEECH_KEY || !process.env.AZURE_SPEECH_REGION) {
      return res.status(500).json({
        success: false,
        message: "Azure Speech Service not configured",
      });
    }

    // Convert base64 to buffer and save as temporary file
    let audioBase64 = audio_file;
    if (audioBase64.startsWith("data:")) {
      audioBase64 = audioBase64.split(",")[1];
    }
    const audioBuffer = Buffer.from(audioBase64, "base64");

    const tempWebMPath = path.join(
      process.cwd(),
      `temp_audio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.webm`
    );
    const tempWavPath = tempWebMPath.replace(".webm", ".wav");

    fs.writeFileSync(tempWebMPath, audioBuffer);
    console.log("Created temporary audio file:", tempWavPath);
    // Convert WebM to WAV using ffmpeg
    await new Promise((resolve, reject) => {
      ffmpeg(tempWebMPath)
        .toFormat("wav")
        .audioFrequency(16000)
        .audioChannels(1)
        .on("end", resolve)
        .on("error", reject)
        .save(tempWavPath);
    });

    // Clean up WebM file
    fs.unlinkSync(tempWebMPath);
    tempFilePath = tempWavPath;

    // Configure Azure Speech Service
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      process.env.AZURE_SPEECH_KEY,
      process.env.AZURE_SPEECH_REGION
    );
    speechConfig.speechRecognitionLanguage = language;

    // Configure audio input from the temporary file
    const audioConfig = sdk.AudioConfig.fromWavFileInput(
      fs.readFileSync(tempFilePath)
    );

    // Create pronunciation assessment configuration
    const pronunciationAssessmentConfig = new sdk.PronunciationAssessmentConfig(
      referenceText,
      sdk.PronunciationAssessmentGradingSystem.HundredMark,
      sdk.PronunciationAssessmentGranularity.Phoneme,
      DimensionKind.Comprehensive,

      true // Enable miscue assessment
    );

    // Enable prosody assessment for more detailed feedback
    pronunciationAssessmentConfig.enableProsodyAssessment = true;

    // Create speech recognizer
    const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

    // Apply pronunciation assessment configuration
    pronunciationAssessmentConfig.applyTo(recognizer);

    // Promise wrapper for the async recognition
    const recognitionResult = await new Promise((resolve, reject) => {
      recognizer.recognizeOnceAsync(
        (result) => {
          recognizer.close();
          resolve(result);
        },
        (error) => {
          recognizer.close();
          reject(error);
        }
      );
    });

    // Process the result
    if (recognitionResult.reason === sdk.ResultReason.RecognizedSpeech) {
      // Get pronunciation assessment results
      const pronunciationResult =
        sdk.PronunciationAssessmentResult.fromResult(recognitionResult);

      // Build detailed response
      const assessment = {
        recognizedText: recognitionResult.text,
        referenceText: referenceText,
        scores: {
          accuracy: Math.round(pronunciationResult.accuracyScore || 0),
          pronunciation: Math.round(
            pronunciationResult.pronunciationScore || 0
          ),
          completeness: Math.round(pronunciationResult.completenessScore || 0),
          fluency: Math.round(pronunciationResult.fluencyScore || 0),
          prosody: Math.round(pronunciationResult.prosodyScore || 0),
        },
        wordDetails: [],
      };

      // Add word-level details if available
      if (
        pronunciationResult.detailResult &&
        pronunciationResult.detailResult.Words
      ) {
        assessment.wordDetails = pronunciationResult.detailResult.Words.map(
          (word, index) => ({
            index: index + 1,
            word: word.Word,
            accuracyScore: Math.round(
              word.PronunciationAssessment?.AccuracyScore || 0
            ),
            errorType: word.PronunciationAssessment?.ErrorType || "None",
          })
        );
      }

      res.json({
        success: true,
        data: assessment,
        metadata: {
          language: language,
          processedAt: new Date().toISOString(),
        },
      });
    } else {
      console.error("Speech recognition failed:", recognitionResult.reason);
      res.status(500).json({
        success: false,
        message: "Speech recognition failed",
        details: `Recognition reason: ${recognitionResult.reason}`,
      });
    }
  } catch (error) {
    console.error("Error evaluating pronunciation:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      details: error.message,
    });
  } finally {
    // Clean up temporary file
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
        console.log("Cleaned up temporary file:", tempFilePath);
      } catch (cleanupError) {
        console.error("Error cleaning up temporary file:", cleanupError);
      }
    }
  }
});

// Helper function to calculate a basic pronunciation score based on recognized text and reference text
// function calculateBasicPronunciationScore(recognizedText, referenceText) {
//   const recognizedWords = recognizedText.toLowerCase().split(/\s+/);
//   const referenceWords = referenceText.toLowerCase().split(/\s+/);

//   let correctWordsCount = 0;
//   const maxLength = Math.max(recognizedWords.length, referenceWords.length);

//   for (
//     let i = 0;
//     i < Math.min(recognizedWords.length, referenceWords.length);
//     i++
//   ) {
//     if (recognizedWords[i] === referenceWords[i]) {
//       correctWordsCount++;
//     }
//   }

//   // Account for completeness (missing or extra words)
//   const completeness =
//     Math.min(recognizedWords.length, referenceWords.length) /
//     referenceWords.length;
//   const accuracy = correctWordsCount / referenceWords.length;

//   return Math.round(accuracy * completeness * 100);
// }

export default router;
