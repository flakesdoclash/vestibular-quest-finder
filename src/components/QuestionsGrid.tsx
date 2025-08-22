import { Question, QuestionCard } from './QuestionCard';
import { Card, CardContent } from '@/components/ui/card';
import { Search, BookOpen } from 'lucide-react';

interface QuestionsGridProps {
  questions: Question[];
  loading?: boolean;
  searched?: boolean;
}

export const QuestionsGrid = ({ questions, loading, searched }: QuestionsGridProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-muted rounded w-20"></div>
                  <div className="h-4 bg-muted rounded w-16"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </div>
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-8 bg-muted rounded"></div>
                  ))}
                </div>
                <div className="h-10 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!searched) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="bg-muted/30 p-6 rounded-full mb-6">
          <Search className="w-12 h-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Use os filtros para buscar questões</h3>
        <p className="text-muted-foreground max-w-md">
          Selecione os filtros acima e clique em "Buscar Questões" para encontrar questões de vestibulares.
        </p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="bg-muted/30 p-6 rounded-full mb-6">
          <BookOpen className="w-12 h-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Nenhuma questão encontrada</h3>
        <p className="text-muted-foreground max-w-md">
          Tente ajustar os filtros de busca para encontrar questões que correspondam aos seus critérios.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          {questions.length} {questions.length === 1 ? 'questão encontrada' : 'questões encontradas'}
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {questions.map((question) => (
          <QuestionCard key={question.id} question={question} />
        ))}
      </div>
    </div>
  );
};