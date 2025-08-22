import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';

interface FilterFormProps {
  onSearch: (filters: FilterData) => void;
  loading?: boolean;
}

export interface FilterData {
  materia_id?: number;
  vestibular_id?: number;
  ano?: number;
  assunto_id?: number[];
  dificuldade?: number;
}

interface Materia {
  id: number;
  nome: string;
}

interface Vestibular {
  id: number;
  nome: string;
}

interface Assunto {
  id: number;
  nome: string;
}

export const FilterForm = ({ onSearch, loading }: FilterFormProps) => {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [vestibulares, setVestibulares] = useState<Vestibular[]>([]);
  const [assuntos, setAssuntos] = useState<Assunto[]>([]);
  const [anos] = useState([2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015]);
  
  const [filters, setFilters] = useState<FilterData>({});
  const [selectedAssuntos, setSelectedAssuntos] = useState<number[]>([]);

  const API_BASE = 'http://localhost:3000';

  useEffect(() => {
    fetchFilterData();
  }, []);

  const fetchFilterData = async () => {
    try {
      const [materiasRes, vestibularesRes, assuntosRes] = await Promise.all([
        fetch(`${API_BASE}/materias`),
        fetch(`${API_BASE}/vestibulares`),
        fetch(`${API_BASE}/assuntos`)
      ]);

      setMaterias(await materiasRes.json());
      setVestibulares(await vestibularesRes.json());
      setAssuntos(await assuntosRes.json());
    } catch (error) {
      console.error('Erro ao carregar dados dos filtros:', error);
    }
  };

  const handleAssuntoToggle = (assuntoId: number) => {
    const newSelectedAssuntos = selectedAssuntos.includes(assuntoId)
      ? selectedAssuntos.filter(id => id !== assuntoId)
      : [...selectedAssuntos, assuntoId];
    
    setSelectedAssuntos(newSelectedAssuntos);
    setFilters(prev => ({ ...prev, assunto_id: newSelectedAssuntos }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const getDifficultyLabel = (value: number) => {
    switch (value) {
      case 1: return 'Fácil';
      case 2: return 'Médio';
      case 3: return 'Difícil';
      default: return '';
    }
  };

  const getDifficultyColor = (value: number) => {
    switch (value) {
      case 1: return 'bg-easy text-easy-foreground';
      case 2: return 'bg-medium text-medium-foreground';
      case 3: return 'bg-hard text-hard-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filtros de Busca
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Matéria</label>
            <Select onValueChange={(value) => setFilters(prev => ({ ...prev, materia_id: Number(value) }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a matéria" />
              </SelectTrigger>
              <SelectContent>
                {materias.map((materia) => (
                  <SelectItem key={materia.id} value={materia.id.toString()}>
                    {materia.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Vestibular</label>
            <Select onValueChange={(value) => setFilters(prev => ({ ...prev, vestibular_id: Number(value) }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o vestibular" />
              </SelectTrigger>
              <SelectContent>
                {vestibulares.map((vestibular) => (
                  <SelectItem key={vestibular.id} value={vestibular.id.toString()}>
                    {vestibular.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Ano</label>
            <Select onValueChange={(value) => setFilters(prev => ({ ...prev, ano: Number(value) }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o ano" />
              </SelectTrigger>
              <SelectContent>
                {anos.map((ano) => (
                  <SelectItem key={ano} value={ano.toString()}>
                    {ano}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Assuntos</label>
          <div className="flex flex-wrap gap-2 p-4 border rounded-md bg-muted/30 min-h-[60px]">
            {assuntos.map((assunto) => (
              <Badge
                key={assunto.id}
                variant={selectedAssuntos.includes(assunto.id) ? "default" : "outline"}
                className="cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground"
                onClick={() => handleAssuntoToggle(assunto.id)}
              >
                {assunto.nome}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Dificuldade</label>
          <div className="flex gap-2">
            {[1, 2, 3].map((dificuldade) => (
              <Button
                key={dificuldade}
                variant={filters.dificuldade === dificuldade ? "default" : "outline"}
                className={filters.dificuldade === dificuldade ? getDifficultyColor(dificuldade) : ''}
                onClick={() => setFilters(prev => ({ 
                  ...prev, 
                  dificuldade: prev.dificuldade === dificuldade ? undefined : dificuldade 
                }))}
              >
                {getDifficultyLabel(dificuldade)}
              </Button>
            ))}
          </div>
        </div>

        <Button 
          onClick={handleSearch} 
          className="w-full md:w-auto"
          disabled={loading}
        >
          <Search className="w-4 h-4 mr-2" />
          {loading ? 'Buscando...' : 'Buscar Questões'}
        </Button>
      </CardContent>
    </Card>
  );
};