// API paths (without base URL) for axios requests
export const API_PATHS = {
  // Authentication
  SIGNIN: "/signin",

  // Student Lessons
  LESSONS: "/api/lessons",
  LESSON: (id: string) => `/api/lessons/${id}`,

  // Teacher Lessons
  ALL_LESSONS: "/api/all-lessons",
  ASSIGN_LESSON: (lessonId: string) => `/api/lessons/${lessonId}/assign`,

  // Users/Students
  USERS: "/api/users",
  USER: (id: string) => `/api/users/${id}`,

  // Teacher - Student Management
  TEACHER_STUDENT: (studentId: string) => `/api/teacher/student/${studentId}`,
  TEACHER_STUDENT_LESSONS: (studentId: string) =>
    `/api/teacher/student/${studentId}/lessons`,
  TEACHER_STUDENT_LESSON: (studentId: string, lessonId: string) =>
    `/api/teacher/student/${studentId}/lesson/${lessonId}`,
  TEACHER_STUDENT_LESSON_FEEDBACK: (studentId: string, lessonId: string) =>
    `/api/teacher/student/${studentId}/lesson/${lessonId}/feedback`,

  // Uploads
  UPLOAD_IMAGE: "/api/upload-image",
  UPLOAD_AUDIO: "/api/upload-audio",
} as const;
