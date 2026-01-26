// Menu items configuration for Teacher and Student dashboards
// Icons from react-icons (already installed in the project)

import { IconType } from 'react-icons';
import {
  FiUsers,
  FiBook,
  FiMic,
  FiLock
} from 'react-icons/fi';

export interface MenuItem {
  id: string;
  title: string;
  url: string;
  icon: IconType;
}

export interface MenuGroup {
  id: string;
  title: string;
  items: MenuItem[];
}

// Teacher menu items
export const teacherMenuItems: MenuGroup[] = [
  {
    id: 'main',
    title: 'Main',
    items: [
      {
        id: 'students',
        title: 'Students',
        url: '/teacher',
        icon: FiUsers,
      },
      {
        id: 'lessons',
        title: 'Lessons',
        url: '/teacher/lessons',
        icon: FiBook,
      },
    ],
  },
  {
    id: 'settings',
    title: 'Settings',
    items: [
      {
        id: 'change-password',
        title: 'Change Password',
        url: '/change-password',
        icon: FiLock,
      },
    ],
  },
];

// Student menu items
export const studentMenuItems: MenuGroup[] = [
  {
    id: 'main',
    title: 'Main',
    items: [
      {
        id: 'lessons',
        title: 'My Lessons',
        url: '/student/lessons',
        icon: FiBook,
      },
      {
        id: 'practice',
        title: 'Practice',
        url: '/student/practice',
        icon: FiMic,
      },
    ],
  },
  {
    id: 'settings',
    title: 'Settings',
    items: [
      {
        id: 'change-password',
        title: 'Change Password',
        url: '/change-password',
        icon: FiLock,
      },
    ],
  },
];
