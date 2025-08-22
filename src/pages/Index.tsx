import { useState } from 'react';
import { FilterForm, FilterData } from '@/components/FilterForm';
import { QuestionsGrid } from '@/components/QuestionsGrid';
import { Question } from '@/components/QuestionCard';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap, BookOpen } from 'lucide-react';

const Index = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const { toast } = useToast();

  const API_BASE = 'http://localhost:3000';

  const buildQueryString = (filters: FilterData) => {
    const params = new URLSearchParams();
    
    if (filters.materia_id) params.append('materia_id', filters.materia_id.toString());
    if (filters.vestibular_id) params.append('vestibular_id', filters.vestibular_id.toString());
    if (filters.ano) params.append('ano', filters.ano.toString());
    if (filters.dificuldade) params.append('dificuldade', filters.dificuldade.toString());
    if (filters.assunto_id && filters.assunto_id.length > 0) {
      filters.assunto_id.forEach(id => params.append('assunto_id', id.toString()));
    }
    
    return params.toString();
  };

  const handleSearch = async (filters: FilterData) => {
    setLoading(true);
    setSearched(true);
    
    try {
      const queryString = buildQueryString(filters);
      const url = `${API_BASE}/questoes${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar questões');
      }
      
      const data = await response.json();
      setQuestions(data);
      
      toast({
        title: "Busca realizada",
        description: `${data.length} ${data.length === 1 ? 'questão encontrada' : 'questões encontradas'}`,
      });
    } catch (error) {
      console.error('Erro ao buscar questões:', error);
      toast({
        title: "Erro na busca",
        description: "Não foi possível buscar as questões. Verifique se o servidor está rodando.",
        variant: "destructive",
      });
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-lg">
                <GraduationCap className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Banco de Questões</h1>
                <p className="text-sm text-muted-foreground">Vestibulares e Concursos</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="w-4 h-4" />
              <span>{questions.length} questões</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <FilterForm onSearch={handleSearch} loading={loading} />
        <QuestionsGrid 
          questions={questions} 
          loading={loading} 
          searched={searched}
        />
      </main>
    </div>
  );
};

export default Index;
