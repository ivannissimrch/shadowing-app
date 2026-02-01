// API paths (without base URL) for axios requests
export const API_PATHS = {
  // Authentication
  SIGNIN: "/signin",

  // Student Lessons
  LESSONS: "/api/lessons",
  LESSON: (id: string) => `/api/lessons/${id}`,

  // Teacher Dashboard
  DASHBOARD_STATS: "/api/teacher/dashboard-stats",
  PENDING_REVIEWS: "/api/teacher/pending-reviews",

  // Teacher Lessons
  CREATE_LESSON: "/api/teacher/lessons",
  ALL_LESSONS: "/api/teacher/all-lessons",
  TEACHER_LESSON: (lessonId: string) => `/api/teacher/lessons/${lessonId}`,
  ASSIGN_LESSON: (lessonId: string) => `/api/teacher/lessons/${lessonId}/assign`,
  UNASSIGN_LESSON: (lessonId: string, studentId: string) =>
    `/api/teacher/lessons/${lessonId}/unassign/${studentId}`,
  DELETE_LESSON: (lessonId: string) => `/api/teacher/lessons/${lessonId}`,

  // Users/Students
  USERS: "/api/users",
  USER: (id: string) => `/api/users/${id}`,
  PASSWORD_CHANGE: (userId: string) => `/api/users/${userId}/password`,
  EMAIL_UPDATE: (userId: string) => `/api/users/${userId}/email`,
  NATIVE_LANGUAGE_UPDATE: (userId: string) => `/api/users/${userId}/native-language`,
  USER_PROFILE: (userId: string) => `/api/users/${userId}`,

  // Teacher - Student Management
  TEACHER_STUDENT: (studentId: string) => `/api/teacher/student/${studentId}`,
  TEACHER_STUDENT_LESSONS: (studentId: string) =>
    `/api/teacher/student/${studentId}/lessons`,
  TEACHER_STUDENT_LESSON: (studentId: string, lessonId: string) =>
    `/api/teacher/student/${studentId}/lesson/${lessonId}`,
  TEACHER_STUDENT_LESSON_FEEDBACK: (studentId: string, lessonId: string) =>
    `/api/teacher/student/${studentId}/lesson/${lessonId}/feedback`,
  TEACHER_STUDENT_LESSON_COMPLETE: (studentId: string, lessonId: string) =>
    `/api/teacher/student/${studentId}/lesson/${lessonId}/complete`,

  // Uploads
  UPLOAD_IMAGE: "/api/upload-image",
  UPLOAD_AUDIO: "/api/upload-audio",
  UPLOAD_VIDEO: "/api/upload-video",

  // Speech
  SPEECH_EVALUATE: "/api/speech/evaluate",
  SPEECH_SYNTHESIZE: "/api/speech/synthesize",
  SPEECH_COACH: "/api/speech/coach",

  // Practice Words
  PRACTICE_WORDS: "/api/practice-words",
  PRACTICE_WORD: (id: number) => `/api/practice-words/${id}`,

  // Lists
  ALL_LISTS: "/api/teacher/lists",
  CREATE_LIST: "/api/teacher/lists",
  LIST: (id: string) => `/api/teacher/lists/${id}`,
  LIST_LESSONS: (id: string) => `/api/teacher/lists/${id}/lessons`,
  LIST_REMOVE_LESSON: (listId: string, lessonId: string) =>
    `/api/teacher/lists/${listId}/lessons/${lessonId}`,
} as const;
