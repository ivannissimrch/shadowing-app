// API paths (without base URL) for axios requests
export const API_PATHS = {
  // Authentication
  SIGNIN: "/signin",

  // Student Lessons
  LESSONS: "/api/lessons",
  LESSON: (id: string) => `/api/lessons/${id}`,

  // Teacher Lessons
  CREATE_LESSON: "/api/teacher/lessons",
  ALL_LESSONS: "/api/teacher/all-lessons",
  ASSIGN_LESSON: (lessonId: string) => `/api/teacher/lessons/${lessonId}/assign`,
  UNASSIGN_LESSON: (lessonId: string, studentId: string) =>
    `/api/teacher/lessons/${lessonId}/unassign/${studentId}`,
  DELETE_LESSON: (lessonId: string) => `/api/teacher/lessons/${lessonId}`,

  // Users/Students
  USERS: "/api/users",
  USER: (id: string) => `/api/users/${id}`,
  PASSWORD_CHANGE: (userId: string) => `/api/users/${userId}/password`,

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
