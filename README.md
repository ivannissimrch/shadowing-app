# ShadowSpeak

A full-stack language learning platform that centralizes ESL shadowing practice with YouTube video integration, browser-based audio recording, and cloud storage, replacing scattered workflows across Google Drive, email, and screen recording software.

**Live Demo:** https://shadowing-app-spec.vercel.app

![ShadowSpeak Teacher Dashboard](./frontend/public/images/teacher.gif)

---

## Problem Statement

ESL teachers and students rely on fragmented tools during online lessons:

- Sharing lesson materials via email or Google Drive (hard to organize)
- Screen recording software video too small on teacher computer
- No centralized place to review past lessons and recordings
- Difficult to track which assignments were completed

**ShadowSpeak** solves this by providing a single platform where teachers can create lessons with precise YouTube segments, students can record directly in the browser with reliable cloud backup, and both can access everything in one organized dashboard, whether during live Zoom sessions or for homework.

---

## Key Features

### For Students

- **YouTube Segment Looping** - Practice specific phrases with start/end times
- **Browser Audio Recording** - Record pronunciation attempts directly in the browser
- **Cloud Submission** - Automatically upload recordings to Azure Blob Storage
- **Progress Tracking** - View lesson completion status and history
- **Teacher Feedback** - Receive written feedback on each submission

### For Teachers

- **Lesson Management** - Create lessons with YouTube videos and custom time segments
- **Student Management** - Add students, assign lessons, track progress
- **Audio Review** - Listen to student recordings with playback controls
- **Feedback System** - Provide written feedback per lesson submission
- **Dashboard Analytics** - View completion rates and student activity

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                            │
│  Next.js 15 (App Router) + React 19 + TypeScript + SWR    │
│                     Deployed on Vercel                      │
└────────────────┬────────────────────────────────────────────┘
                 │ HTTPS/REST API
                 │ JWT Authentication
┌────────────────▼────────────────────────────────────────────┐
│                         Backend                             │
│        Express.js + PostgreSQL + JWT + Multer              │
│                   Deployed on Render                        │
└────────────────┬────────────────────────────────────────────┘
                 │
         ┌───────┴───────┐
         │               │
┌────────▼──────┐ ┌─────▼──────────┐
│  PostgreSQL   │ │ Azure Blob     │
│   Database    │ │ Storage        │
│   (Render)    │ │ (Images/Audio) │
└───────────────┘ └────────────────┘
```

---

## Tech Stack

### Frontend

| Technology               | Purpose                                             |
| ------------------------ | --------------------------------------------------- |
| **Next.js 15**           | React framework with App Router (Server Components) |
| **React 19**             | UI library with latest concurrent features          |
| **TypeScript**           | Type safety and developer experience                |
| **SWR**                  | Data fetching with automatic revalidation           |
| **Material-UI**          | Component library for forms and dialogs             |
| **Axios**                | HTTP client with interceptors for auth              |
| **react-youtube**        | YouTube video embedding and control                 |
| **react-error-boundary** | Error handling and recovery                         |

### Backend

| Technology             | Purpose                                           |
| ---------------------- | ------------------------------------------------- |
| **Express.js**         | RESTful API framework                             |
| **PostgreSQL**         | Relational database for users/lessons/assignments |
| **JWT**                | Stateless authentication tokens                   |
| **bcrypt**             | Password hashing (10 rounds)                      |
| **Multer**             | Multipart file upload handling                    |
| **Azure Blob Storage** | Cloud storage for images and audio                |
| **CORS**               | Cross-origin resource sharing                     |

### Testing

| Technology | Purpose                      |
| ---------- | ---------------------------- |
| **Vitest** | Unit and integration testing |

---

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 14+
- Azure Storage Account (or use local storage for development)

### Installation

1. **Clone the repository**

```bash
git clone git@github.com:ivannissimrch/shadowing-app.git
cd shadowspeak
```

2. **Set up the backend**

```bash
cd backend
npm install

# Create .env file

DATABASE_URL=postgresql://user:password@localhost:5432/shadowspeak
JWT_SECRET=your-secret-key-change-in-production
AZURE_STORAGE_CONNECTION_STRING=your-azure-connection-string
AZURE_STORAGE_ACCOUNT_NAME=your-storage-account-name
PORT=3001

# Start backend server
npm run dev
```

3. **Set up the frontend**

```bash
cd ../frontend
npm install

# Create .env.local file
NEXT_PUBLIC_API_URL=http://localhost:3001cat > .env.local

# Start development server
npm run dev
```

4. **Access the application**

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

---

## Key Technical Implementations

### 1. YouTube Segment Looping

```typescript
// Precise time-based looping with millisecond accuracy
const handlePlayerStateChange = (event: YouTubeEvent) => {
  if (event.data === PlayerState.PLAYING) {
    const interval = setInterval(() => {
      const currentTime = event.target.getCurrentTime();
      if (currentTime >= endTime) {
        event.target.seekTo(startTime);
      }
    }, 100); // Check every 100ms for precision
  }
};
```

### 2. Browser Audio Recording → Azure Upload

```typescript
// MediaRecorder API → Blob → Azure Blob Storage pipeline
const handleStopRecording = async (audioBlob: Blob) => {
  const base64Audio = await blobToBase64(audioBlob);
  const { data } = await axios.post("/api/upload-audio", {
    audio: base64Audio,
    lessonId: currentLessonId,
  });
  return data.audioUrl; // Azure blob URL
};
```

### 3. JWT Authentication with Axios Interceptors

```typescript
// Automatically attach token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);
```

### 4. Role-Based Access Control

```typescript
// Middleware protects routes based on JWT role claim
const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded; // { id, username, role }
  next();
};

// Teacher-only routes
router.delete("/api/lessons/:id", protect, requireTeacher, deleteLesson);
```

---

## Security Features

- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Authentication**: Stateless tokens with expiration
- **HTTPS Only**: All production traffic encrypted
- **CORS Protection**: Whitelisted domains only
- **SQL Injection Prevention**: Parameterized queries with pg library
- **File Upload Validation**: Type and size restrictions
- **Environment Variables**: Secrets stored outside codebase

---

## Database Schema

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL, -- bcrypt hashed
  name VARCHAR(255),
  email VARCHAR(255),
  role VARCHAR(50) DEFAULT 'student', -- 'student' | 'teacher'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Lessons table
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  image TEXT, -- Azure blob URL
  video_id VARCHAR(255), -- YouTube video ID
  lesson_start_time INTEGER, -- milliseconds
  lesson_end_time INTEGER, -- milliseconds
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Assignments table (joins students to lessons)
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'new',
  assigned_by UUID REFERENCES users(id) ON DELETE SET NULL,
  assigned_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  audio_file TEXT, -- Azure blob URL of student recording
  feedback TEXT, -- Teacher's written feedback
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, lesson_id)
);
```

---

## API Documentation

### Authentication

| Endpoint  | Method | Auth | Description                               |
| --------- | ------ | ---- | ----------------------------------------- |
| `/signin` | POST   | None | Login with username/password, returns JWT |

### Student Endpoints

| Endpoint           | Method | Auth     | Description                               |
| ------------------ | ------ | -------- | ----------------------------------------- |
| `/api/lessons`     | GET    | Required | Get all assigned lessons for current user |
| `/api/lessons/:id` | GET    | Required | Get specific lesson details               |
| `/api/lessons/:id` | PATCH  | Required | Submit audio recording for lesson         |

### Teacher Endpoints

| Endpoint                                                    | Method | Auth    | Description                           |
| ----------------------------------------------------------- | ------ | ------- | ------------------------------------- |
| `/api/all-lessons`                                          | GET    | Teacher | Get all lessons with assignment stats |
| `/api/lessons`                                              | POST   | Teacher | Create new lesson                     |
| `/api/lessons/:id/assign`                                   | POST   | Teacher | Assign lesson to student              |
| `/api/lessons/:id`                                          | DELETE | Teacher | Delete lesson                         |
| `/api/users`                                                | GET    | Teacher | List all students                     |
| `/api/users`                                                | POST   | Teacher | Create new student account            |
| `/api/users/:id`                                            | DELETE | Teacher | Delete student                        |
| `/api/teacher/student/:studentId/lessons`                   | GET    | Teacher | Get student's lesson history          |
| `/api/teacher/student/:studentId/lesson/:lessonId`          | GET    | Teacher | Get specific student submission       |
| `/api/teacher/student/:studentId/lesson/:lessonId/feedback` | PATCH  | Teacher | Add feedback to submission            |

### Upload Endpoints

| Endpoint            | Method | Auth     | Description                               |
| ------------------- | ------ | -------- | ----------------------------------------- |
| `/api/upload-image` | POST   | Teacher  | Upload lesson image (multipart/form-data) |
| `/api/upload-audio` | POST   | Required | Upload student audio recording (base64)   |

---

## What I Learned Building This

I built this to solve a real problem I was experiencing in my ESL classes - we were constantly juggling between Google Drive for lesson materials, email for sharing recordings, and dealing with screen-sharing software that would randomly stop working during Zoom calls. My teacher and I needed a centralized solution.

### Technical Skills

- **SWR for Data Fetching**: Learned how to use swr to fetch data
- **PostgreSQL Schema Design**: Designed relational schema with foreign keys and cascade deletes for user-lesson-assignment relationships
- **Azure Blob Storage**: Integrated cloud storage for images and audio files, handled connection strings and container management
- **Browser MediaRecorder API**: Implemented audio recording with blob conversion
- **JWT Authentication**: Built complete auth flow from token generation to role-based route protection

### Architectural Decisions

- **Why PostgreSQL**: My data is inherently relational (students have many assignments, lessons can be assigned to many students) - foreign key constraints made sense
- **Why Azure**: Already familiar with Azure ecosystem, and wanted to potentially integrate Speech-to-Text API later
- **Why SWR**: Lighter than React Query, and the automatic revalidation fit my use case perfectly

### Challenges Overcome

1. **YouTube Segment Looping**: The YouTube API doesn't natively support looping specific segments, so I built custom interval-based tracking to seek back to start time when the end time is reached. Required careful state management and cleanup.

2. **Role-Based Access Control**: Implemented both client-side and server-side route protection, with JWT middleware that checks user roles before allowing teacher-only actions like deleting lessons or viewing student submissions.

3. **Error Handling Strategy**: Built multiple layers of error handling - error boundaries for component crashes, Axios interceptors for API errors, try-catch blocks for async operations, and user-friendly error messages instead of technical stack traces.

---

### Planned Features

- AI Pronunciation Scoring - Azure Speech API integration for automated feedback
- Real-time Updates - WebSocket notifications when teachers assign lessons
- Advanced Analytics - Student progress charts, completion trends
- Lesson Marketplace - Teachers share/sell lesson packs
- Gamification - Streaks, badges, leaderboards
- Offline Mode - Service workers for practicing without internet

---

## Contributing

This is a portfolio project, but feedback and suggestions are welcome. Feel free to open issues for bugs or feature requests.

---

## License

MIT License - feel free to use this code for learning or your own projects.

---
