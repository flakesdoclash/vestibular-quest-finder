import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, Play, BookOpen } from 'lucide-react';

export interface Question {
  id: number;
  enunciado: string;
  opcoes: string[];
  resposta_correta: string;
  dificuldade: number;
  resolucao: string;
  video_resolucao?: string;
  materia?: string;
  vestibular?: string;
  ano?: number;
  assunto?: string;
}

interface QuestionCardProps {
  question: Question;
}

export const QuestionCard = ({ question }: QuestionCardProps) => {
  const [showResolution, setShowResolution] = useState(false);

  const getDifficultyLabel = (dificuldade: number) => {
    switch (dificuldade) {
      case 1: return 'Fácil';
      case 2: return 'Médio';
      case 3: return 'Difícil';
      default: return 'N/A';
    }
  };

  const getDifficultyColor = (dificuldade: number) => {
    switch (dificuldade) {
      case 1: return 'bg-easy text-easy-foreground';
      case 2: return 'bg-medium text-medium-foreground';
      case 3: return 'bg-hard text-hard-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatOption = (option: string, index: number) => {
    const letters = ['A', 'B', 'C', 'D', 'E'];
    return `${letters[index]}) ${option}`;
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs">
              #{question.id}
            </Badge>
            <Badge 
              className={`text-xs ${getDifficultyColor(question.dificuldade)}`}
            >
              {getDifficultyLabel(question.dificuldade)}
            </Badge>
            {question.materia && (
              <Badge variant="secondary" className="text-xs">
                {question.materia}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            {question.vestibular && <span>{question.vestibular}</span>}
            {question.ano && <span>• {question.ano}</span>}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="prose prose-sm max-w-none">
          <p className="text-foreground leading-relaxed">{question.enunciado}</p>
        </div>

        {question.opcoes && question.opcoes.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground">Alternativas:</h4>
            <div className="space-y-2">
              {question.opcoes.map((opcao, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-md border text-sm transition-colors ${
                    opcao === question.resposta_correta
                      ? 'bg-success/10 border-success text-success-foreground'
                      : 'bg-muted/30 border-border'
                  }`}
                >
                  {formatOption(opcao, index)}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 pt-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1">
                <Eye className="w-4 h-4 mr-2" />
                Ver Resolução
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Resolução da Questão #{question.id}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Enunciado:</h3>
                    <p className="text-sm text-muted-foreground bg-muted/30 p-4 rounded-md">
                      {question.enunciado}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Resposta Correta:</h3>
                    <p className="text-sm bg-success/10 text-success-foreground p-3 rounded-md border border-success">
                      {question.resposta_correta}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Resolução:</h3>
                  <div className="prose prose-sm max-w-none">
                    <p className="leading-relaxed whitespace-pre-wrap">{question.resolucao}</p>
                  </div>
                </div>

                {question.video_resolucao && (
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Play className="w-4 h-4" />
                      Vídeo Resolução:
                    </h3>
                    <div className="aspect-video">
                      <iframe
                        src={question.video_resolucao}
                        title="Vídeo Resolução"
                        className="w-full h-full rounded-md"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
          
          {question.assunto && (
            <Badge variant="outline" className="text-xs">
              {question.assunto}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};