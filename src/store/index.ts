import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Project, Reservation, ProjectSuggestion, SiteSettings } from '@/types';
import heroBg from '@/assets/hero-bg.jpg';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, promotion?: string) => Promise<boolean>;
  logout: () => void;
  updatePromotion: (promotion: string) => void;
}

interface DataState {
  projects: Project[];
  reservations: Reservation[];
  suggestions: ProjectSuggestion[];
  users: User[];
  settings: SiteSettings;
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addReservation: (reservation: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
  updateReservation: (id: string, updates: Partial<Reservation>) => void;
  addSuggestion: (suggestion: Omit<ProjectSuggestion, 'id' | 'createdAt' | 'status'>) => void;
  deleteUser: (id: string) => void;
  updateSettings: (settings: Partial<SiteSettings>) => void;
}

// Demo data
const demoProjects: Project[] = [
  {
    id: '1',
    title: 'Application de Gestion de Bibliothèque',
    description: 'Développez une application complète pour gérer les emprunts et retours de livres dans une bibliothèque universitaire.',
    price: 150,
    duration: '4 semaines',
    difficulty: 'Moyen',
    level: 'Bac2',
    technologies: ['Python', 'SQLite', 'Tkinter'],
    createdAt: new Date(),
  },
  {
    id: '2',
    title: 'Site E-commerce Simplifié',
    description: 'Créez un site de vente en ligne avec panier, authentification et paiement simulé.',
    price: 200,
    duration: '6 semaines',
    difficulty: 'Difficile',
    level: 'Bac3',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    createdAt: new Date(),
  },
  {
    id: '3',
    title: 'Calculatrice Scientifique',
    description: 'Implémentez une calculatrice avec fonctions trigonométriques et graphiques.',
    price: 80,
    duration: '2 semaines',
    difficulty: 'Facile',
    level: 'Bac1',
    technologies: ['Python', 'Matplotlib'],
    createdAt: new Date(),
  },
  {
    id: '4',
    title: 'Système de Réservation de Salles',
    description: 'Application web pour réserver des salles de cours avec calendrier interactif.',
    price: 180,
    duration: '5 semaines',
    difficulty: 'Moyen',
    level: 'Bac2',
    technologies: ['Vue.js', 'Firebase', 'FullCalendar'],
    createdAt: new Date(),
  },
  {
    id: '5',
    title: 'API REST Complète',
    description: 'Développez une API RESTful avec authentification JWT et documentation Swagger.',
    price: 250,
    duration: '8 semaines',
    difficulty: 'Expert',
    level: 'Master1',
    technologies: ['Node.js', 'Express', 'PostgreSQL', 'JWT', 'Swagger'],
    createdAt: new Date(),
  },
  {
    id: '6',
    title: 'Application Mobile de Notes',
    description: 'Créez une application mobile cross-platform pour prendre et organiser des notes.',
    price: 220,
    duration: '6 semaines',
    difficulty: 'Difficile',
    level: 'Master1',
    technologies: ['React Native', 'Redux', 'AsyncStorage'],
    createdAt: new Date(),
  },
];

const adminUser: User = {
  id: 'admin',
  email: 'admin',
  name: 'Administrateur',
  role: 'admin',
  createdAt: new Date(),
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        // Admin login
        if (email === 'admin' && password === 'admin123') {
          set({ user: adminUser, isAuthenticated: true });
          return true;
        }
        
        // Check registered users
        const users = useDataStore.getState().users;
        const user = users.find(u => u.email === email);
        if (user) {
          set({ user, isAuthenticated: true });
          return true;
        }
        
        return false;
      },
      register: async (email: string, password: string, name: string, promotion?: string) => {
        const users = useDataStore.getState().users;
        if (users.some(u => u.email === email)) {
          return false;
        }
        
        const newUser: User = {
          id: crypto.randomUUID(),
          email,
          name,
          role: 'student',
          promotion: promotion as any,
          createdAt: new Date(),
        };
        
        useDataStore.setState(state => ({
          users: [...state.users, newUser],
        }));
        
        set({ user: newUser, isAuthenticated: true });
        return true;
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      updatePromotion: (promotion: string) => {
        const { user } = get();
        if (user) {
          const updatedUser = { ...user, promotion: promotion as any };
          set({ user: updatedUser });
          useDataStore.setState(state => ({
            users: state.users.map(u => u.id === user.id ? updatedUser : u),
          }));
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export const useDataStore = create<DataState>()(
  persist(
    (set) => ({
      projects: demoProjects,
      reservations: [],
      suggestions: [],
      users: [],
      settings: {
        backgroundImage: heroBg,
        siteName: 'AcadémiaPro',
        welcomeMessage: 'Votre plateforme de projets académiques',
      },
      addProject: (project) => {
        const newProject: Project = {
          ...project,
          id: crypto.randomUUID(),
          createdAt: new Date(),
        };
        set(state => ({ projects: [...state.projects, newProject] }));
      },
      updateProject: (id, updates) => {
        set(state => ({
          projects: state.projects.map(p => p.id === id ? { ...p, ...updates } : p),
        }));
      },
      deleteProject: (id) => {
        set(state => ({
          projects: state.projects.filter(p => p.id !== id),
        }));
      },
      addReservation: (reservation) => {
        const newReservation: Reservation = {
          ...reservation,
          id: crypto.randomUUID(),
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set(state => ({ reservations: [...state.reservations, newReservation] }));
      },
      updateReservation: (id, updates) => {
        set(state => ({
          reservations: state.reservations.map(r => 
            r.id === id ? { ...r, ...updates, updatedAt: new Date() } : r
          ),
        }));
      },
      addSuggestion: (suggestion) => {
        const newSuggestion: ProjectSuggestion = {
          ...suggestion,
          id: crypto.randomUUID(),
          status: 'pending',
          createdAt: new Date(),
        };
        set(state => ({ suggestions: [...state.suggestions, newSuggestion] }));
      },
      deleteUser: (id) => {
        set(state => ({
          users: state.users.filter(u => u.id !== id),
          reservations: state.reservations.filter(r => r.userId !== id),
          suggestions: state.suggestions.filter(s => s.userId !== id),
        }));
      },
      updateSettings: (newSettings) => {
        set(state => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },
    }),
    {
      name: 'data-storage',
    }
  )
);
