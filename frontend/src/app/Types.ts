export interface Lesson {
  title: string;
  image: string;
  video_id: string;
  lesson_id: string;
  status: string;
  audio_file: string;
}

export interface LessonsContextType {
  lessons: Lesson[] | undefined | null;
  addAudioToLesson: (id: string, audioFile: string) => void;
  openAlertDialog: () => void;
  closeAlertDialog: () => void;
  isAlertDialogOpen: boolean;
  token: string | null;
  updateToken: (newToken: string) => void;
}

export interface User {
  name: string;
  email: string;
  lessons: Lesson[];
}

export interface RecorderProps {
  selectedLesson: Lesson | undefined;
  updateSelectedLesson: (updatedLesson: Lesson) => void;
}
