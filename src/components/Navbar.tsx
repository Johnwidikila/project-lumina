import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store';
import { GraduationCap, Menu, X, LogOut, User, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-md border-b border-primary-foreground/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-lg bg-golden/20 group-hover:bg-golden/30 transition-colors">
              <GraduationCap className="h-6 w-6 text-golden" />
            </div>
            <span className="font-display text-xl font-bold text-primary-foreground">
              AcadémiaPro
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className="text-primary-foreground/80 hover:text-golden transition-colors font-medium"
            >
              Accueil
            </Link>
            <Link 
              to="/projects" 
              className="text-primary-foreground/80 hover:text-golden transition-colors font-medium"
            >
              Projets
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'}>
                  <Button variant="golden" size="sm" className="gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <div className="flex items-center gap-2 text-primary-foreground/80">
                  <User className="h-4 w-4" />
                  <span className="text-sm">{user?.name}</span>
                </div>
                <Button 
                  variant="hero-outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Déconnexion
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="hero-outline" size="sm">
                    Connexion
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="golden" size="sm">
                    S'inscrire
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-primary-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-primary-foreground/10">
            <div className="flex flex-col gap-4">
              <Link 
                to="/" 
                className="text-primary-foreground/80 hover:text-golden transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link 
                to="/projects" 
                className="text-primary-foreground/80 hover:text-golden transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Projets
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link 
                    to={user?.role === 'admin' ? '/admin' : '/dashboard'}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button variant="golden" className="w-full gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button 
                    variant="hero-outline" 
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Déconnexion
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="hero-outline" className="w-full">
                      Connexion
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="golden" className="w-full">
                      S'inscrire
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
