# Shadowing App – Project Specification

An app to help English learners improve their spoken English by mimicking native speech. Users practice by shadowing video clips from YouTube, recording their voice, and receiving feedback on pronunciation and intonation.

**Tech Stack**

- Frontend: React, Material-UI, Next.js.
- Backend: Express
- Audio Analysis: Parselmouth (Python), Azure Speech API
- Media: YouTube API for video import

---

## Requirements

### Core Features

## MVP

- have predefined list of videos to choose from
- Import and playback YouTube videos
- Play the video in 10–15 second segments, looped
- Record and playback the user’s voice
- Side-by-side comparison between native and user audio
- Feedback on: Pronunciation accuracy (word or syllable level)

## Stretch Goals

- Graph of intonation curve and pitch contour
- Display captions when playing video

---

## User Stories

- As a user, I want to import a YouTube video and play it in short segments so I can shadow effectively.
- As a learner, I want each segment to repeat automatically so I can practice without manually rewinding.
- As a learner, I want to compare my recording to the native speaker to improve my pronunciation.
- As a user, I want to get basic feedback on which words I mispronounced.
- As a User, I want to use the app without logging in.

---

## Spikes (Technical Research)

| Topic                | Goal                                                                            | Status      |
| -------------------- | ------------------------------------------------------------------------------- | ----------- |
| Azure Speech API     | Test pronunciation scoring and speech-to-text accuracy for user recordings      | In progress |
| YouTube API          | Test video import and segment slicing for shadowing playback                    | In progress |
| React Audio Recorder | Find best library for in-browser recording with waveform preview                | Not started |
| Parselmouth          | Analyze pitch, intonation feedback (and visualize it), maybe for a stretch goal | Not started |
