export type UserRole = 'student' | 'admin';

export type ProjectLevel = 'Bac1' | 'Bac2' | 'Bac3' | 'Master1' | 'Master2';

export type ProjectDifficulty = 'Facile' | 'Moyen' | 'Difficile' | 'Expert';

export type ReservationStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  promotion?: ProjectLevel;
  createdAt: Date;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  difficulty: ProjectDifficulty;
  level: ProjectLevel;
  technologies: string[];
  imageUrl?: string;
  createdAt: Date;
}

export interface Reservation {
  id: string;
  projectId: string;
  userId: string;
  status: ReservationStatus;
  message?: string;
  adminResponse?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectSuggestion {
  id: string;
  userId: string;
  title: string;
  description: string;
  technologies: string[];
  status: 'pending' | 'reviewed';
  createdAt: Date;
}

export interface SiteSettings {
  backgroundImage: string;
  siteName: string;
  welcomeMessage: string;
}
