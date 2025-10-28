export interface AppContextType {
  openAlertDialog: (title: string, message: string) => void;
  closeAlertDialog: () => void;
  isAlertDialogOpen: boolean;
  token: string | null;
  updateToken: (newToken: string | null) => void;
  alertDialogTitle: string;
  alertDialogMessage: string;
}

export interface Lesson {
  title: string;
  image: string;
  video_id: string;
  id: string;
  status: string;
  audio_file: string;
  assigned_at: string | null;
  completed: boolean;
  completed_at: string | null;
  lesson_start_time: string | null;
  lesson_end_time: string | null;
  created_at: string;
  updated_at: string;
  feedback: string | null;
}

//User can be either a student or an admin
export interface User {
  name: string;
  email: string;
  lessons: Lesson[];
}

export interface Student {
  id: string;
  role: string;
  username: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string | null;
}

export interface SignInResponse {
  data: {
    token: string;
  };
}

export interface Assignment {
  id: string;
  student_id: string;
  lesson_id: string;
  completed: boolean;
  status: string;
  assigned_by: string | null;
  assigned_at: string;
  completed_at: string | null;
  updated_at: string;
  audio_file: string | null;
}

export type AssignmentResponse = ApiResponse<Assignment>;
export type LessonResponse = ApiResponse<Lesson>;
export type LessonsResponse = ApiResponse<Lesson[]>;
export type UserResponse = ApiResponse<User>;
export type AuthResponse = { token: string; user: User };
export type ImageResponse = {
  imageName: string;
  imageUrl: string;
};
export type AudioUploadResponse = { audioUrl: string };

export interface RecorderPanelContextType {
  recording: boolean;
  paused: boolean;
  audioURL: string | null;
  startRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  stopRecording: () => void;
  handleSubmit: () => Promise<void>;
  setAudioURL: (url: string | null) => void;
  setRecording: (isRecording: boolean) => void;
  setPaused: (isPaused: boolean) => void;
  errorMessage: string;
  setErrorMessage: (message: string) => void;
  isAudioMutating: boolean;
  isLessonMutating: boolean;
}
