const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const API_KEYS = {
  // Authentication
  SIGNIN: `${API_URL}/signin`,

  // Student Lessons
  LESSONS: `${API_URL}/api/lessons`,
  LESSON: (id: string) => `${API_URL}/api/lessons/${id}`,

  // Teacher Lessons
  ALL_LESSONS: `${API_URL}/api/all-lessons`,
  ASSIGN_LESSON: (lessonId: string) =>
    `${API_URL}/api/lessons/${lessonId}/assign`,

  // Users/Students
  USERS: `${API_URL}/api/users`,
  USER: (id: string) => `${API_URL}/api/users/${id}`,

  // Teacher - Student Management
  TEACHER_STUDENT: (studentId: string) =>
    `${API_URL}/api/teacher/student/${studentId}`,
  TEACHER_STUDENT_LESSONS: (studentId: string) =>
    `${API_URL}/api/teacher/student/${studentId}/lessons`,
  TEACHER_STUDENT_LESSON: (studentId: string, lessonId: string) =>
    `${API_URL}/api/teacher/student/${studentId}/lesson/${lessonId}`,

  // Uploads
  UPLOAD_IMAGE: `${API_URL}/api/upload-image`,
} as const;

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

  // Uploads
  UPLOAD_IMAGE: "/api/upload-image",
} as const;

export default API_KEYS;
