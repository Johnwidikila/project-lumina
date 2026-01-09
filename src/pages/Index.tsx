import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ProjectCard from '@/components/ProjectCard';
import { useDataStore, useAuthStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Shield, Clock, Headphones } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { Project } from '@/types';

const Index = () => {
  const { projects, addReservation } = useDataStore();
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [reservationMessage, setReservationMessage] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  // Featured projects (first 3)
  const featuredProjects = projects.slice(0, 3);

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
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      
      {/* Featured Projects */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold mb-4">
              Projets <span className="text-gradient">Populaires</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Découvrez nos projets les plus demandés par les étudiants
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {featuredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onReserve={() => handleReserve(project)}
              />
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/projects">
              <Button variant="golden" size="lg" className="gap-2 group">
                Voir tous les projets
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold mb-4">
              Pourquoi <span className="text-gradient">Nous Choisir</span> ?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Star,
                title: 'Qualité garantie',
                description: 'Projets soigneusement élaborés par des experts',
              },
              {
                icon: Clock,
                title: 'Livraison rapide',
                description: 'Respect des délais pour chaque projet',
              },
              {
                icon: Shield,
                title: 'Confidentialité',
                description: 'Vos informations restent privées et sécurisées',
              },
              {
                icon: Headphones,
                title: 'Support 24/7',
                description: 'Assistance disponible à tout moment',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl bg-card border border-border hover:border-golden/30 transition-all duration-300 hover:shadow-lg group"
              >
                <div className="p-3 rounded-lg bg-golden/10 w-fit mb-4 group-hover:bg-golden/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-golden" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-academic">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-4xl font-bold text-cream mb-4">
            Prêt à commencer ?
          </h2>
          <p className="text-cream/70 mb-8 max-w-xl mx-auto">
            Rejoignez des centaines d'étudiants qui ont déjà fait confiance à AcadémiaPro
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button variant="hero" size="xl" className="gap-2">
                Créer un compte gratuit
              </Button>
            </Link>
            <Link to="/projects">
              <Button variant="hero-outline" size="xl">
                Explorer les projets
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 bg-academic-dark">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-cream/70 text-sm">
              © 2024 AcadémiaPro. Tous droits réservés.
            </div>
            <div className="flex items-center gap-6">
              <Link to="/" className="text-cream/70 hover:text-golden text-sm transition-colors">
                Accueil
              </Link>
              <Link to="/projects" className="text-cream/70 hover:text-golden text-sm transition-colors">
                Projets
              </Link>
              <Link to="/login" className="text-cream/70 hover:text-golden text-sm transition-colors">
                Connexion
              </Link>
            </div>
          </div>
        </div>
      </footer>
      
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

export default Index;
