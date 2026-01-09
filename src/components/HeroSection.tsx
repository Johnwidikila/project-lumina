import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useDataStore } from '@/store';
import { ArrowRight, BookOpen, Users, Award, Shield } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';

const HeroSection = () => {
  const { settings } = useDataStore();

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${settings.backgroundImage || heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-hero-pattern" />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-golden/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-golden/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-golden/20 backdrop-blur-sm border border-golden/30 mb-8 animate-fade-in">
            <Award className="h-4 w-4 text-golden" />
            <span className="text-golden text-sm font-medium">Plateforme académique de référence</span>
          </div>
          
          <h1 className="font-display text-5xl md:text-7xl font-bold text-cream mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Réussissez vos{' '}
            <span className="text-gradient">Projets Académiques</span>
          </h1>
          
          <p className="text-xl text-cream/80 mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {settings.welcomeMessage || 'Découvrez notre catalogue de projets de qualité, adaptés à votre niveau et à vos objectifs académiques.'}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Link to="/projects">
              <Button variant="hero" size="xl" className="gap-2 group">
                Explorer les projets
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="hero-outline" size="xl">
                Créer un compte
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '0.8s' }}>
          {[
            { icon: BookOpen, label: 'Projets disponibles', value: '50+' },
            { icon: Users, label: 'Étudiants satisfaits', value: '200+' },
            { icon: Award, label: 'Taux de réussite', value: '95%' },
            { icon: Shield, label: 'Support 24/7', value: '100%' },
          ].map((stat, index) => (
            <div 
              key={stat.label}
              className="text-center p-4 rounded-xl bg-cream/5 backdrop-blur-sm border border-cream/10"
            >
              <stat.icon className="h-8 w-8 text-golden mx-auto mb-2" />
              <div className="text-2xl font-bold text-cream">{stat.value}</div>
              <div className="text-sm text-cream/60">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
