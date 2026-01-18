export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  email: string | null;
  role: "student" | "teacher";
  created_at: Date;
}

export interface Lesson {
  id: string;
  title: string;
  image: string | null;
  video_id: string | null;
  lesson_start_time: number | null;
  lesson_end_time: number | null;
  created_at: Date;
  updated_at: Date;
}

// Lesson joined with assignment data (for student views)
export interface LessonWithAssignment extends Lesson {
  status: "new" | "in_progress" | "completed";
  completed: boolean;
  assigned_at: Date;
  completed_at: Date | null;
  audio_file: string | null;
  feedback?: string | null;
}

// Lesson with aggregated stats (for teacher dashboard)
export interface LessonWithStats extends Lesson {
  assignment_count: number;
  completed_count: number;
}

export interface Assignment {
  id: string;
  student_id: string;
  lesson_id: string;
  completed: boolean;
  status: "new" | "in_progress" | "completed";
  assigned_by: string | null;
  assigned_at: Date;
  completed_at: Date | null;
  updated_at: Date;
  audio_file: string | null;
  feedback: string | null;
}

// Auth types
export interface JwtPayload {
  id: string;
  username: string;
  role: "student" | "teacher";
}

// API response types
export interface ApiError {
  error: string;
  message?: string;
  status?: number;
}

// Signin request body
export interface SigninBody {
  username: string;
  password: string;
}

// Create user request body
export interface CreateUserBody {
  username: string;
  password: string;
  name: string;
  email?: string;
  role?: "student" | "teacher";
}

// Create lesson request body
export interface CreateLessonBody {
  title: string;
  image?: string;
  videoId?: string;
  lessonStartTime?: number;
  lessonEndTime?: number;
}

// Create assignment input
export interface CreateAssignmentBody {
  studentId: string;
  lessonId: string;
  assignedBy?: string;
}

// Assignment with lesson info (for joined queries)
export interface AssignmentWithLesson extends Assignment {
  lesson_title: string;
  lesson_image: string | null;
  video_id?: string | null;
  lesson_start_time?: number | null;
  lesson_end_time?: number | null;
}

// Update password request body
export interface UpdatePasswordBody {
  currentPassword: string;
  newPassword: string;
}

// Feedback request body
export interface FeedbackBody {
  feedback: string;
}

// Practice words for pronunciation practice
export interface PracticeWord {
  id: number;
  student_id: string;
  word: string;
  created_at: Date;
}
