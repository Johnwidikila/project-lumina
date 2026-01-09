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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  BookOpen, Users, Settings, FolderPlus, Trash2, Edit, 
  CheckCircle, XCircle, MessageSquare, Image, Save,
  AlertCircle, LayoutDashboard, Calendar, Clock
} from 'lucide-react';
import { toast } from 'sonner';
import { Project, ProjectLevel, ProjectDifficulty, ReservationStatus } from '@/types';
import heroBg from '@/assets/hero-bg.jpg';

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { 
    projects, reservations, users, suggestions, settings,
    addProject, updateProject, deleteProject,
    updateReservation, deleteUser, updateSettings
  } = useDataStore();
  
  // Project form state
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    difficulty: '' as ProjectDifficulty | '',
    level: '' as ProjectLevel | '',
    technologies: '',
  });
  
  // Response dialog state
  const [responseDialogOpen, setResponseDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<string | null>(null);
  const [adminResponse, setAdminResponse] = useState('');
  
  // Settings state
  const [newBgImage, setNewBgImage] = useState(settings.backgroundImage);
  const [newSiteName, setNewSiteName] = useState(settings.siteName);
  const [newWelcomeMessage, setNewWelcomeMessage] = useState(settings.welcomeMessage);

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const levels: ProjectLevel[] = ['Bac1', 'Bac2', 'Bac3', 'Master1', 'Master2'];
  const difficulties: ProjectDifficulty[] = ['Facile', 'Moyen', 'Difficile', 'Expert'];

  const getStatusBadge = (status: ReservationStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning"><AlertCircle className="h-3 w-3 mr-1" />En attente</Badge>;
      case 'approved':
        return <Badge variant="success"><CheckCircle className="h-3 w-3 mr-1" />Approuvé</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Refusé</Badge>;
    }
  };

  const getProjectById = (id: string) => projects.find(p => p.id === id);
  const getUserById = (id: string) => users.find(u => u.id === id);

  const openProjectDialog = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setProjectForm({
        title: project.title,
        description: project.description,
        price: project.price.toString(),
        duration: project.duration,
        difficulty: project.difficulty,
        level: project.level,
        technologies: project.technologies.join(', '),
      });
    } else {
      setEditingProject(null);
      setProjectForm({
        title: '',
        description: '',
        price: '',
        duration: '',
        difficulty: '',
        level: '',
        technologies: '',
      });
    }
    setProjectDialogOpen(true);
  };

  const handleProjectSubmit = () => {
    if (!projectForm.title || !projectForm.description || !projectForm.price || 
        !projectForm.duration || !projectForm.difficulty || !projectForm.level) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const projectData = {
      title: projectForm.title,
      description: projectForm.description,
      price: parseFloat(projectForm.price),
      duration: projectForm.duration,
      difficulty: projectForm.difficulty as ProjectDifficulty,
      level: projectForm.level as ProjectLevel,
      technologies: projectForm.technologies.split(',').map(t => t.trim()).filter(Boolean),
    };

    if (editingProject) {
      updateProject(editingProject.id, projectData);
      toast.success('Projet modifié avec succès !');
    } else {
      addProject(projectData);
      toast.success('Projet créé avec succès !');
    }

    setProjectDialogOpen(false);
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      deleteProject(id);
      toast.success('Projet supprimé');
    }
  };

  const handleReservationAction = (id: string, status: ReservationStatus) => {
    updateReservation(id, { status });
    toast.success(`Réservation ${status === 'approved' ? 'approuvée' : 'refusée'}`);
  };

  const openResponseDialog = (reservationId: string) => {
    const reservation = reservations.find(r => r.id === reservationId);
    setSelectedReservation(reservationId);
    setAdminResponse(reservation?.adminResponse || '');
    setResponseDialogOpen(true);
  };

  const handleSendResponse = () => {
    if (selectedReservation) {
      updateReservation(selectedReservation, { adminResponse });
      toast.success('Réponse envoyée');
      setResponseDialogOpen(false);
    }
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      deleteUser(id);
      toast.success('Utilisateur supprimé');
    }
  };

  const handleSaveSettings = () => {
    updateSettings({
      backgroundImage: newBgImage,
      siteName: newSiteName,
      welcomeMessage: newWelcomeMessage,
    });
    toast.success('Paramètres sauvegardés !');
  };

  // Stats
  const pendingReservations = reservations.filter(r => r.status === 'pending').length;
  const totalStudents = users.length;
  const totalProjects = projects.length;

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
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-golden/20">
              <LayoutDashboard className="h-8 w-8 text-golden" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-cream">
                Tableau de bord Admin
              </h1>
              <p className="text-cream/70">Gérez votre plateforme AcadémiaPro</p>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: BookOpen, label: 'Projets', value: totalProjects, color: 'text-golden' },
              { icon: Users, label: 'Étudiants', value: totalStudents, color: 'text-cream' },
              { icon: Clock, label: 'En attente', value: pendingReservations, color: 'text-warning' },
              { icon: Calendar, label: 'Suggestions', value: suggestions.length, color: 'text-cream' },
            ].map((stat) => (
              <div key={stat.label} className="p-4 rounded-xl bg-cream/5 backdrop-blur-sm border border-cream/10">
                <stat.icon className={`h-6 w-6 ${stat.color} mb-2`} />
                <div className="text-2xl font-bold text-cream">{stat.value}</div>
                <div className="text-sm text-cream/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Dashboard Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="projects" className="space-y-6">
            <TabsList className="grid w-full max-w-2xl grid-cols-4">
              <TabsTrigger value="projects" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Projets
              </TabsTrigger>
              <TabsTrigger value="reservations" className="gap-2">
                <Calendar className="h-4 w-4" />
                Réservations
              </TabsTrigger>
              <TabsTrigger value="users" className="gap-2">
                <Users className="h-4 w-4" />
                Utilisateurs
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                <Settings className="h-4 w-4" />
                Paramètres
              </TabsTrigger>
            </TabsList>
            
            {/* Projects Tab */}
            <TabsContent value="projects" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-semibold">Gestion des Projets</h2>
                <Dialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="golden" className="gap-2" onClick={() => openProjectDialog()}>
                      <FolderPlus className="h-4 w-4" />
                      Ajouter un projet
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>{editingProject ? 'Modifier le projet' : 'Nouveau projet'}</DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                      <div className="space-y-2">
                        <Label>Titre *</Label>
                        <Input
                          value={projectForm.title}
                          onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
                          placeholder="Titre du projet"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Description *</Label>
                        <Textarea
                          value={projectForm.description}
                          onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                          placeholder="Description du projet"
                          rows={3}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Prix (€) *</Label>
                          <Input
                            type="number"
                            value={projectForm.price}
                            onChange={(e) => setProjectForm({...projectForm, price: e.target.value})}
                            placeholder="100"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Durée *</Label>
                          <Input
                            value={projectForm.duration}
                            onChange={(e) => setProjectForm({...projectForm, duration: e.target.value})}
                            placeholder="4 semaines"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Niveau *</Label>
                          <Select 
                            value={projectForm.level} 
                            onValueChange={(v) => setProjectForm({...projectForm, level: v as ProjectLevel})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                            <SelectContent>
                              {levels.map((level) => (
                                <SelectItem key={level} value={level}>{level}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Difficulté *</Label>
                          <Select 
                            value={projectForm.difficulty} 
                            onValueChange={(v) => setProjectForm({...projectForm, difficulty: v as ProjectDifficulty})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                            <SelectContent>
                              {difficulties.map((diff) => (
                                <SelectItem key={diff} value={diff}>{diff}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Technologies</Label>
                        <Input
                          value={projectForm.technologies}
                          onChange={(e) => setProjectForm({...projectForm, technologies: e.target.value})}
                          placeholder="React, Node.js, MongoDB (séparées par des virgules)"
                        />
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setProjectDialogOpen(false)}>
                        Annuler
                      </Button>
                      <Button variant="golden" onClick={handleProjectSubmit}>
                        {editingProject ? 'Modifier' : 'Créer'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              <Card variant="elevated">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Titre</TableHead>
                      <TableHead>Niveau</TableHead>
                      <TableHead>Difficulté</TableHead>
                      <TableHead>Prix</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">{project.title}</TableCell>
                        <TableCell><Badge variant="level">{project.level}</Badge></TableCell>
                        <TableCell>{project.difficulty}</TableCell>
                        <TableCell className="text-golden font-semibold">{project.price}€</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => openProjectDialog(project)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteProject(project.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>
            
            {/* Reservations Tab */}
            <TabsContent value="reservations" className="space-y-6">
              <h2 className="font-display text-2xl font-semibold">Gestion des Réservations</h2>
              
              <Card variant="elevated">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Projet</TableHead>
                      <TableHead>Étudiant</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reservations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          Aucune réservation
                        </TableCell>
                      </TableRow>
                    ) : (
                      reservations.map((reservation) => {
                        const project = getProjectById(reservation.projectId);
                        const student = getUserById(reservation.userId);
                        
                        return (
                          <TableRow key={reservation.id}>
                            <TableCell className="font-medium">{project?.title || 'Projet inconnu'}</TableCell>
                            <TableCell>{student?.name || 'Étudiant inconnu'}</TableCell>
                            <TableCell>{new Date(reservation.createdAt).toLocaleDateString('fr-FR')}</TableCell>
                            <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                {reservation.status === 'pending' && (
                                  <>
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => handleReservationAction(reservation.id, 'approved')}
                                    >
                                      <CheckCircle className="h-4 w-4 text-success" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => handleReservationAction(reservation.id, 'rejected')}
                                    >
                                      <XCircle className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </>
                                )}
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => openResponseDialog(reservation.id)}
                                >
                                  <MessageSquare className="h-4 w-4 text-golden" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </Card>
              
              {/* Response Dialog */}
              <Dialog open={responseDialogOpen} onOpenChange={setResponseDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Répondre à la réservation</DialogTitle>
                    <DialogDescription>
                      Envoyez un message à l'étudiant concernant sa réservation
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="py-4">
                    <Label>Votre réponse</Label>
                    <Textarea
                      value={adminResponse}
                      onChange={(e) => setAdminResponse(e.target.value)}
                      placeholder="Écrivez votre message..."
                      rows={4}
                      className="mt-2"
                    />
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setResponseDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button variant="golden" onClick={handleSendResponse}>
                      Envoyer
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>
            
            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6">
              <h2 className="font-display text-2xl font-semibold">Gestion des Utilisateurs</h2>
              
              <Card variant="elevated">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Promotion</TableHead>
                      <TableHead>Inscrit le</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          Aucun utilisateur inscrit
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell className="font-medium">{u.name}</TableCell>
                          <TableCell>{u.email}</TableCell>
                          <TableCell>
                            {u.promotion ? <Badge variant="level">{u.promotion}</Badge> : '-'}
                          </TableCell>
                          <TableCell>{new Date(u.createdAt).toLocaleDateString('fr-FR')}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeleteUser(u.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>
            
            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <h2 className="font-display text-2xl font-semibold">Paramètres du Site</h2>
              
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="h-5 w-5" />
                    Apparence
                  </CardTitle>
                  <CardDescription>
                    Personnalisez l'apparence de votre plateforme
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Nom du site</Label>
                    <Input
                      value={newSiteName}
                      onChange={(e) => setNewSiteName(e.target.value)}
                      placeholder="AcadémiaPro"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Message d'accueil</Label>
                    <Textarea
                      value={newWelcomeMessage}
                      onChange={(e) => setNewWelcomeMessage(e.target.value)}
                      placeholder="Bienvenue sur notre plateforme..."
                      rows={2}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>URL de l'image de fond</Label>
                    <Input
                      value={newBgImage}
                      onChange={(e) => setNewBgImage(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                    <p className="text-xs text-muted-foreground">
                      Entrez l'URL d'une image pour changer le fond du site
                    </p>
                  </div>
                  
                  {newBgImage && (
                    <div className="rounded-lg overflow-hidden border">
                      <img 
                        src={newBgImage} 
                        alt="Aperçu du fond" 
                        className="w-full h-40 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = heroBg;
                        }}
                      />
                    </div>
                  )}
                  
                  <Button variant="golden" onClick={handleSaveSettings} className="gap-2">
                    <Save className="h-4 w-4" />
                    Sauvegarder les paramètres
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
