import supabase from "../../servers/SupabaseConect";
import { useState, useEffect } from "react";
import styles from './styles.module.css';
import PubliCards from "../Cards";
import ImportAlunos from "../importpdf.js";
import { useAuth } from "../../context/AuthContext";

const ListClass = () => {
  const { user, complit } = useAuth();
  const [fetchError, setFetchError] = useState(null);
  const [publis, setPublis] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedEscola, setSelectedEscola] = useState('');
  const [selectedCurso, setSelectedCurso] = useState('');
  const [selectedTurma, setSelectedTurma] = useState('');
  const [escolasOptions, setEscolasOptions] = useState([]);
  const [cursosOptions, setCursosOptions] = useState([]);
  const [turmasOptions, setTurmasOptions] = useState([]);

  useEffect(() => {
    if (complit) {
      const fetchProfessorData = async () => {
        if (user && user.email) {
          const { data: professorData, error: professorError } = await supabase
            .from('professores')
            .select('escola, Curso, Turma')
            .eq('email', user.email)
            .single();

          if (professorError) {
            console.error('Erro ao buscar dados do professor:', professorError.message);
            return;
          }

          if (professorData) {
            setSelectedEscola(professorData.escola);
            setSelectedCurso(professorData.Curso); 
            setSelectedTurma(professorData.Turma);

            // Atualizar opções de escola
            const { data: escolas, error: escolasError } = await supabase
              .from('alunos')
              .select('Instituicao')
              .eq('Instituicao', professorData.escola);

            if (escolasError) {
              console.error('Erro ao buscar opções de escola:', escolasError.message);
              return;
            }

            if (escolas) {
              const uniqueEscolas = Array.from(new Set(escolas.map(escola => escola.Instituicao)))
                .map(escola => ({ value: escola, label: escola }));
              
              setEscolasOptions(uniqueEscolas);
            }

            // Atualizar opções de curso e turma
            const { data: cursos, error: cursosError } = await supabase
              .from('alunos')
              .select('Curso')
              .eq('Instituicao', professorData.escola);

            if (cursosError) {
              console.error('Erro ao buscar opções de curso:', cursosError.message);
              return;
            }

            if (cursos) {
              const uniqueCursos = Array.from(new Set(cursos.map(curso => curso.Curso)))
                .map(curso => ({ value: curso, label: curso }));
              
              setCursosOptions(uniqueCursos);

              // Definir o curso selecionado se estiver presente na lista
              if (professorData.Curso && uniqueCursos.some(curso => curso.value === professorData.Curso)) {
                setSelectedCurso(professorData.Curso);
              }
            }

            const { data: turmas, error: turmasError } = await supabase
              .from('alunos')
              .select('Turma')
              .eq('Instituicao', professorData.escola);

            if (turmasError) {
              console.error('Erro ao buscar opções de turma:', turmasError.message);
              return;
            }

            if (turmas) {
              const uniqueTurmas = Array.from(new Set(turmas.map(turma => turma.Turma)))
                .map(turma => ({ value: turma, label: turma }));
              
              setTurmasOptions(uniqueTurmas);
            }
          }
        }
      };

      fetchProfessorData();
    }
  }, [complit, user]);

  useEffect(() => {
    const fetchPubli = async () => {
      if (selectedEscola && selectedCurso && selectedTurma) {
        let query = supabase.from('alunos').select();

        if (selectedEscola) {
          query = query.eq('Instituicao', selectedEscola);
        }

        if (selectedCurso) {
          query = query.eq('Curso', selectedCurso);
        }

        if (selectedTurma) {
          query = query.eq('Turma', selectedTurma);
        }

        const { data, error } = await query;

        if (error) {
          setFetchError('Sem nada para mostrar');
          setPublis([]);
          console.log(error);
        } else {
          setPublis(data || []);
          setSearchResults(data || []);
          setFetchError(null);
        }
      }
    };

    fetchPubli();

    const channel = supabase.channel('custom-all-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'alunos' },
        (payload) => {
          console.log('Change received!', payload);
          fetchPubli();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [selectedEscola, selectedCurso, selectedTurma]);

  useEffect(() => {
    if (!selectedEscola) {
      setSearchResults([]);
      return;
    }

    let filteredResults = publis || [];

    if (selectedEscola) {
      filteredResults = filteredResults.filter(publi => publi.Instituicao === selectedEscola);
    }

    if (selectedCurso) {
      filteredResults = filteredResults.filter(publi => publi.Curso === selectedCurso);
    }

    if (selectedTurma) {
      filteredResults = filteredResults.filter(publi => publi.Turma === selectedTurma);
    }

    if (searchTerm) {
      filteredResults = filteredResults.filter(publi => (
        (publi.name && publi.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (publi.serie && publi.serie.toLowerCase().includes(searchTerm.toLowerCase()))
      ));
    }

    setSearchResults(filteredResults);
  }, [searchTerm, selectedEscola, selectedCurso, selectedTurma, publis]);

  if (!complit) {
    return <div>Nada para mostrar</div>;
  }

  return (
    <div className={styles.pagehome}>
      <div className="containertopbar">
        <div className={styles.container}>
          <div className="wellcomemobi"></div>
          <div className={styles.selects}>
            <select 
              value={selectedEscola}
              onChange={e => setSelectedEscola(e.target.value)}
              className={styles.select}
            >
              <option value="">Escola</option>
              {escolasOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div className={styles.selects}>
            <select
              value={selectedCurso || ''} // Defina o valor ou vazio
              onChange={(e) => setSelectedCurso(e.target.value)}
              className={styles.select}
            >
              <option value="">Curso</option>
              {cursosOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div className={styles.selects}>
            <select
              value={selectedTurma}
              onChange={(e) => setSelectedTurma(e.target.value)}
              className={styles.select}
            >
              <option value="">Turma</option>
              {turmasOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className={styles.contSearch}>
            <input
              type="text"
              placeholder="Pesquisar por nome ou série..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.selectsearch}
            />
          </div>

          <div className={styles.selectspdf}>
            <ImportAlunos />
          </div>
        </div>
      </div>
      {fetchError && (<p>{fetchError}</p>)}
      {selectedEscola && searchResults && searchResults.length > 0 ? (
        <div className="grid-container">
          {searchResults.map(publi => (
            <PubliCards key={publi.id} publi={publi} />
          ))}
        </div>
      ) : (
        <div>
          <p>Nenhum resultado encontrado.</p>
        </div>
      )}
    </div>
  );
};

export default ListClass;
