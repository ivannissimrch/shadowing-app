export interface Lesson {
  title: string;
  image: string;
  videoId: string;
  lessonId: string;
  status: string;
  audioFile: string;
}

export interface LessonsContextType {
  lessons: Lesson[] | undefined;
  addAudioToLesson: (id: string, audioFile: string) => void;
}
