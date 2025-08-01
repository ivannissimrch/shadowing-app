export interface Lesson {
  title: string;
  image: string;
  videoId: string;
  lessonId: string;
  status: string;
}

export interface LessonsContextType {
  lessons: Lesson[] | undefined;
  setActiveLesson: (id: string) => void;
  getActiveLesson: () => Lesson | void;
}
