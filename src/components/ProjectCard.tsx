import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Project } from '@/types';
import { Clock, DollarSign, Layers, Zap } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onReserve?: () => void;
  showReserveButton?: boolean;
}

const difficultyColors: Record<string, string> = {
  Facile: 'bg-success/20 text-success border-success/30',
  Moyen: 'bg-warning/20 text-warning border-warning/30',
  Difficile: 'bg-destructive/20 text-destructive border-destructive/30',
  Expert: 'bg-academic/20 text-academic border-academic/30',
};

const ProjectCard = ({ project, onReserve, showReserveButton = true }: ProjectCardProps) => {
  return (
    <Card variant="elevated" className="group overflow-hidden card-hover">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge variant="level" className="text-xs">
            {project.level}
          </Badge>
          <Badge className={`text-xs border ${difficultyColors[project.difficulty]}`}>
            {project.difficulty}
          </Badge>
        </div>
        <CardTitle className="text-lg leading-tight group-hover:text-academic transition-colors">
          {project.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {project.description}
        </p>
        
        <div className="flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 4).map((tech) => (
            <Badge key={tech} variant="secondary" className="text-xs">
              {tech}
            </Badge>
          ))}
          {project.technologies.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{project.technologies.length - 4}
            </Badge>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-golden" />
            <span className="font-semibold text-academic">{project.price}€</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{project.duration}</span>
          </div>
        </div>
      </CardContent>
      
      {showReserveButton && onReserve && (
        <CardFooter className="pt-0">
          <Button 
            variant="golden" 
            className="w-full"
            onClick={onReserve}
          >
            Réserver ce projet
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ProjectCard;
