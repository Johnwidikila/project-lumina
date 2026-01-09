import { useState } from 'react';
import Navbar from '@/components/Navbar';
import ProjectCard from '@/components/ProjectCard';
import { useDataStore, useAuthStore } from '@/store';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Project, ProjectLevel, ProjectDifficulty } from '@/types';
import heroBg from '@/assets/hero-bg.jpg';

const ProjectsPage = () => {
  const { projects, addReservation, settings } = useDataStore();
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [reservationMessage, setReservationMessage] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const levels: ProjectLevel[] = ['Bac1', 'Bac2', 'Bac3', 'Master1', 'Master2'];
  const difficulties: ProjectDifficulty[] = ['Facile', 'Moyen', 'Difficile', 'Expert'];

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(search.toLowerCase()) ||
      project.description.toLowerCase().includes(search.toLowerCase()) ||
      project.technologies.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchesLevel = levelFilter === 'all' || project.level === levelFilter;
    const matchesDifficulty = difficultyFilter === 'all' || project.difficulty === difficultyFilter;
    return matchesSearch && matchesLevel && matchesDifficulty;
  });

  const handleReserve = (project: Project) => {
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter pour réserver un projet');
      navigate('/login');
      return;
    }
    setSelectedProject(project);
    setDialogOpen(true);
  };

  const confirmReservation = () => {
    if (selectedProject && user) {
      addReservation({
        projectId: selectedProject.id,
        userId: user.id,
        message: reservationMessage,
      });
      toast.success('Réservation envoyée avec succès !');
      setDialogOpen(false);
      setSelectedProject(null);
      setReservationMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section 
        className="relative pt-32 pb-16"
        style={{
          backgroundImage: `linear-gradient(135deg, hsl(210 60% 25% / 0.9) 0%, hsl(210 70% 15% / 0.95) 100%), url(${settings.backgroundImage || heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-cream text-center mb-4">
            Catalogue des Projets
          </h1>
          <p className="text-cream/70 text-center max-w-2xl mx-auto mb-8">
            Découvrez notre sélection de projets adaptés à tous les niveaux académiques
          </p>
          
          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto glass-card rounded-xl p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un projet..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous niveaux</SelectItem>
                  {levels.map((level) => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Difficulté" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes difficultés</SelectItem>
                  {difficulties.map((diff) => (
                    <SelectItem key={diff} value={diff}>{diff}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>
      
      {/* Projects Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground">
                {filteredProjects.length} projet{filteredProjects.length !== 1 ? 's' : ''} trouvé{filteredProjects.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
          
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onReserve={() => handleReserve(project)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun projet trouvé</h3>
              <p className="text-muted-foreground">
                Essayez de modifier vos filtres de recherche
              </p>
            </div>
          )}
        </div>
      </section>
      
      {/* Reservation Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Réserver ce projet</DialogTitle>
            <DialogDescription>
              Vous allez réserver : <strong>{selectedProject?.title}</strong>
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Message (optionnel)</label>
              <Textarea
                placeholder="Ajoutez un message pour l'administrateur..."
                value={reservationMessage}
                onChange={(e) => setReservationMessage(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex justify-between text-sm mb-1">
                <span>Prix</span>
                <span className="font-semibold text-golden">{selectedProject?.price}€</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Durée estimée</span>
                <span>{selectedProject?.duration}</span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="golden" onClick={confirmReservation}>
              Confirmer la réservation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectsPage;
