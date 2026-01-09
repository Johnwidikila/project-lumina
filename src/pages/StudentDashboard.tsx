import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useAuthStore, useDataStore } from '@/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { BookOpen, Clock, MessageSquare, Send, User, GraduationCap, Lightbulb, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ProjectLevel, ReservationStatus } from '@/types';
import heroBg from '@/assets/hero-bg.jpg';

const StudentDashboard = () => {
  const { user, isAuthenticated, updatePromotion } = useAuthStore();
  const { projects, reservations, suggestions, addSuggestion, settings } = useDataStore();
  
  const [suggestionTitle, setSuggestionTitle] = useState('');
  const [suggestionDesc, setSuggestionDesc] = useState('');
  const [suggestionTech, setSuggestionTech] = useState('');
  const [newPromotion, setNewPromotion] = useState(user?.promotion || '');
  const [dialogOpen, setDialogOpen] = useState(false);

  if (!isAuthenticated || user?.role !== 'student') {
    return <Navigate to="/login" replace />;
  }

  const levels: ProjectLevel[] = ['Bac1', 'Bac2', 'Bac3', 'Master1', 'Master2'];
  
  const userReservations = reservations.filter(r => r.userId === user.id);
  const userSuggestions = suggestions.filter(s => s.userId === user.id);

  const getStatusBadge = (status: ReservationStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning" className="gap-1"><AlertCircle className="h-3 w-3" />En attente</Badge>;
      case 'approved':
        return <Badge variant="success" className="gap-1"><CheckCircle className="h-3 w-3" />Approuvé</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" />Refusé</Badge>;
    }
  };

  const getProjectById = (id: string) => projects.find(p => p.id === id);

  const handleSuggestion = () => {
    if (!suggestionTitle.trim() || !suggestionDesc.trim()) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    addSuggestion({
      userId: user.id,
      title: suggestionTitle,
      description: suggestionDesc,
      technologies: suggestionTech.split(',').map(t => t.trim()).filter(Boolean),
    });
    
    toast.success('Suggestion envoyée avec succès !');
    setSuggestionTitle('');
    setSuggestionDesc('');
    setSuggestionTech('');
    setDialogOpen(false);
  };

  const handlePromotionUpdate = () => {
    if (newPromotion) {
      updatePromotion(newPromotion);
      toast.success('Promotion mise à jour !');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <section 
        className="relative pt-24 pb-12"
        style={{
          backgroundImage: `linear-gradient(135deg, hsl(210 60% 25% / 0.9) 0%, hsl(210 70% 15% / 0.95) 100%), url(${settings.backgroundImage || heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-golden/20">
              <User className="h-8 w-8 text-golden" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-cream">
                Bonjour, {user.name} 👋
              </h1>
              <p className="text-cream/70">Bienvenue sur votre espace étudiant</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 mt-4">
            <Badge variant="golden" className="gap-1">
              <GraduationCap className="h-3 w-3" />
              {user.promotion || 'Non définie'}
            </Badge>
            <span className="text-cream/50">•</span>
            <span className="text-cream/70 text-sm">{user.email}</span>
          </div>
        </div>
      </section>
      
      {/* Dashboard Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="reservations" className="space-y-6">
            <TabsList className="grid w-full max-w-lg grid-cols-3">
              <TabsTrigger value="reservations" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Réservations
              </TabsTrigger>
              <TabsTrigger value="suggestions" className="gap-2">
                <Lightbulb className="h-4 w-4" />
                Suggestions
              </TabsTrigger>
              <TabsTrigger value="profile" className="gap-2">
                <User className="h-4 w-4" />
                Profil
              </TabsTrigger>
            </TabsList>
            
            {/* Reservations Tab */}
            <TabsContent value="reservations" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-semibold">Mes Réservations</h2>
                <Badge variant="outline">{userReservations.length} réservation(s)</Badge>
              </div>
              
              {userReservations.length > 0 ? (
                <div className="grid gap-4">
                  {userReservations.map((reservation) => {
                    const project = getProjectById(reservation.projectId);
                    if (!project) return null;
                    
                    return (
                      <Card key={reservation.id} variant="elevated">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">{project.title}</CardTitle>
                              <CardDescription className="flex items-center gap-2 mt-1">
                                <Clock className="h-3 w-3" />
                                {new Date(reservation.createdAt).toLocaleDateString('fr-FR')}
                              </CardDescription>
                            </div>
                            {getStatusBadge(reservation.status)}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center gap-4 text-sm">
                              <Badge variant="level">{project.level}</Badge>
                              <span className="text-golden font-semibold">{project.price}€</span>
                              <span className="text-muted-foreground">{project.duration}</span>
                            </div>
                            
                            {reservation.message && (
                              <div className="p-3 rounded-lg bg-muted/50">
                                <p className="text-sm text-muted-foreground">
                                  <span className="font-medium">Votre message :</span> {reservation.message}
                                </p>
                              </div>
                            )}
                            
                            {reservation.adminResponse && (
                              <div className="p-3 rounded-lg bg-golden/10 border border-golden/20">
                                <p className="text-sm flex items-start gap-2">
                                  <MessageSquare className="h-4 w-4 text-golden mt-0.5" />
                                  <span>
                                    <span className="font-medium text-golden">Réponse admin :</span>{' '}
                                    {reservation.adminResponse}
                                  </span>
                                </p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card variant="glass" className="text-center py-12">
                  <CardContent>
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Aucune réservation</h3>
                    <p className="text-muted-foreground mb-4">
                      Vous n'avez pas encore réservé de projet
                    </p>
                    <Button variant="golden" onClick={() => window.location.href = '/projects'}>
                      Explorer les projets
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            {/* Suggestions Tab */}
            <TabsContent value="suggestions" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-semibold">Mes Suggestions</h2>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="golden" className="gap-2">
                      <Lightbulb className="h-4 w-4" />
                      Suggérer un projet
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Suggérer un projet</DialogTitle>
                      <DialogDescription>
                        Proposez une idée de projet à l'équipe AcadémiaPro
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Titre du projet *</Label>
                        <Input
                          placeholder="Ex: Application de gestion de tâches"
                          value={suggestionTitle}
                          onChange={(e) => setSuggestionTitle(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Description *</Label>
                        <Textarea
                          placeholder="Décrivez votre idée de projet..."
                          value={suggestionDesc}
                          onChange={(e) => setSuggestionDesc(e.target.value)}
                          rows={4}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Technologies souhaitées</Label>
                        <Input
                          placeholder="Ex: React, Node.js, MongoDB (séparées par des virgules)"
                          value={suggestionTech}
                          onChange={(e) => setSuggestionTech(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setDialogOpen(false)}>
                        Annuler
                      </Button>
                      <Button variant="golden" onClick={handleSuggestion} className="gap-2">
                        <Send className="h-4 w-4" />
                        Envoyer
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              {userSuggestions.length > 0 ? (
                <div className="grid gap-4">
                  {userSuggestions.map((suggestion) => (
                    <Card key={suggestion.id} variant="elevated">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                          <Badge variant={suggestion.status === 'reviewed' ? 'success' : 'secondary'}>
                            {suggestion.status === 'reviewed' ? 'Examiné' : 'En attente'}
                          </Badge>
                        </div>
                        <CardDescription>
                          {new Date(suggestion.createdAt).toLocaleDateString('fr-FR')}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">{suggestion.description}</p>
                        {suggestion.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {suggestion.technologies.map((tech) => (
                              <Badge key={tech} variant="secondary" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card variant="glass" className="text-center py-12">
                  <CardContent>
                    <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Aucune suggestion</h3>
                    <p className="text-muted-foreground">
                      Vous n'avez pas encore soumis de suggestion de projet
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <h2 className="font-display text-2xl font-semibold">Mon Profil</h2>
              
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Nom</Label>
                      <Input value={user.name} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input value={user.email} disabled />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Promotion</Label>
                    <div className="flex gap-3">
                      <Select value={newPromotion} onValueChange={setNewPromotion}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Sélectionnez votre promotion" />
                        </SelectTrigger>
                        <SelectContent>
                          {levels.map((level) => (
                            <SelectItem key={level} value={level}>{level}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button variant="golden" onClick={handlePromotionUpdate}>
                        Mettre à jour
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default StudentDashboard;
