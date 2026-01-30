// Menu items configuration for Teacher and Student dashboards
// Icons from react-icons (already installed in the project)

import { IconType } from 'react-icons';
import {
  FiHome,
  FiUsers,
  FiBook,
  FiMic,
  FiSettings,
  FiClock,
  FiList
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
        id: 'dashboard',
        title: 'Dashboard',
        url: '/teacher',
        icon: FiHome,
      },
      {
        id: 'students',
        title: 'Students',
        url: '/teacher/students',
        icon: FiUsers,
      },
      {
        id: 'lessons',
        title: 'Lessons',
        url: '/teacher/lessons',
        icon: FiBook,
      },
      {
        id: 'lists',
        title: 'Lists',
        url: '/teacher/lists',
        icon: FiList,
      },
      {
        id: 'reviews',
        title: 'Reviews',
        url: '/teacher/reviews',
        icon: FiClock,
      },
    ],
  },
  {
    id: 'settings',
    title: 'Settings',
    items: [
      {
        id: 'settings',
        title: 'Settings',
        url: '/settings',
        icon: FiSettings,
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
        id: 'settings',
        title: 'Settings',
        url: '/settings',
        icon: FiSettings,
      },
    ],
  },
];
