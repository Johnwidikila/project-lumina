import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuthStore } from '@/store';
import { GraduationCap, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ProjectLevel } from '@/types';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [promotion, setPromotion] = useState<ProjectLevel | ''>('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuthStore();
  const navigate = useNavigate();

  const levels: ProjectLevel[] = ['Bac1', 'Bac2', 'Bac3', 'Master1', 'Master2'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!promotion) {
      setError('Veuillez sélectionner votre promotion.');
      return;
    }
    
    setLoading(true);

    try {
      const success = await register(email, password, name, promotion);
      if (success) {
        toast.success('Inscription réussie ! Bienvenue sur AcadémiaPro');
        navigate('/dashboard');
      } else {
        setError('Cet email est déjà utilisé. Essayez de vous connecter.');
      }
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-academic to-academic-dark p-4">
      <Card variant="glass" className="w-full max-w-md animate-scale-in">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto p-3 rounded-xl bg-golden/20 w-fit">
            <GraduationCap className="h-8 w-8 text-golden" />
          </div>
          <div>
            <CardTitle className="text-2xl">Créer un compte</CardTitle>
            <CardDescription className="mt-2">
              Rejoignez la communauté AcadémiaPro
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Jean Dupont"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  minLength={6}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="promotion">Promotion</Label>
              <Select value={promotion} onValueChange={(value) => setPromotion(value as ProjectLevel)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez votre promotion" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button type="submit" variant="golden" className="w-full" disabled={loading}>
              {loading ? 'Inscription...' : "S'inscrire"}
            </Button>
            
            <p className="text-center text-sm text-muted-foreground">
              Déjà un compte ?{' '}
              <Link to="/login" className="text-golden hover:underline font-medium">
                Se connecter
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
