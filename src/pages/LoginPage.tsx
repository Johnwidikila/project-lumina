import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store';
import { GraduationCap, Mail, Lock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast.success('Connexion réussie !');
        const user = useAuthStore.getState().user;
        navigate(user?.role === 'admin' ? '/admin' : '/dashboard');
      } else {
        setError('Identifiants incorrects. Vérifiez votre email et mot de passe.');
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
            <CardTitle className="text-2xl">Connexion</CardTitle>
            <CardDescription className="mt-2">
              Connectez-vous à votre compte AcadémiaPro
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
              <Label htmlFor="email">Email ou identifiant</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="text"
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
                />
              </div>
            </div>
            
            <Button type="submit" variant="golden" className="w-full" disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
            
            <p className="text-center text-sm text-muted-foreground">
              Pas encore de compte ?{' '}
              <Link to="/register" className="text-golden hover:underline font-medium">
                S'inscrire
              </Link>
            </p>
            
            <div className="mt-4 p-3 rounded-lg bg-muted/50 text-sm">
              <p className="font-medium text-muted-foreground mb-1">Compte admin :</p>
              <p className="text-muted-foreground">Email: <code className="bg-muted px-1 rounded">admin</code></p>
              <p className="text-muted-foreground">Mot de passe: <code className="bg-muted px-1 rounded">admin123</code></p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
