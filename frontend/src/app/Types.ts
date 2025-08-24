export interface Lesson {
  title: string;
  image: string;
  videoId: string;
  lessonId: string;
  status: string;
  audioFile: string;
}

export interface LessonsContextType {
  lessons: Lesson[] | undefined | null;
  addAudioToLesson: (id: string, audioFile: string) => void;
  openSnackBar: () => void;
  closeSnackBar: () => void;
  isSnackBarOpen: boolean;
  token: string | null;
  updateToken: (newToken: string) => void;
}

export interface User {
  name: string;
  email: string;
  lessons: Lesson[];
}
