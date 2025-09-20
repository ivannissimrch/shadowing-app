export interface Lesson {
  title: string;
  image: string;
  video_id: string;
  id: string;
  status: string;
  audio_file: string;
}

export interface AppContextType {
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
