import supabase from "../../servers/SupabaseConect";
import { useState, useEffect } from "react";
import styles from './styles.module.css';
import PubliCards from "../Cards";
import ImportAlunos from "../importpdf.js";

const ListClass = () => {
  const [fetchError, setFetchError] = useState(null);
  const [publis, setPublis] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedSeries, setSelectedSeries] = useState('');
  const [selectedEscola, setSelectedEscola] = useState('');
  const [selectedTurno, setSelectedTurno] = useState('');


  useEffect(() => {
    const fetchPubli = async () => {
      const { data, error } = await supabase
        .from('alunos')
        .select();

      if (error) {
        setFetchError('Sem nada para mostrar');
        setPublis(null);
        console.log(error);
      }

      if (data) {
        setPublis(data);
        setSearchResults(data); // Inicialmente, exibir todos os resultados
        setFetchError(null);
      }
    };

    fetchPubli();

    const channel = supabase.channel('custom-all-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'alunos' },
        (payload) => {
          console.log('Change received!', payload);
          fetchPubli(); // Atualiza os dados quando houver alteração
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  // Função para filtrar os resultados com base no termo de pesquisa, série, escola e turno selecionados
  useEffect(() => {
    if (!searchTerm && !selectedSeries && !selectedEscola && !selectedTurno) {
      setSearchResults(publis);
      return;
    }

    let filteredResults = publis;

    if (selectedEscola) {
      filteredResults = filteredResults.filter(publi => publi.Instituicao === selectedEscola);
    }

    if (selectedTurno) {
      filteredResults = filteredResults.filter(publi => publi.Turno === selectedTurno);
    }

    if (searchTerm) {
      filteredResults = filteredResults.filter(publi => (
        (publi.name && publi.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (publi.serie && publi.serie.toLowerCase().includes(searchTerm.toLowerCase()))
      ));
    }

    if (selectedSeries) {
      filteredResults = filteredResults.filter(publi => publi.serie === selectedSeries);
    }

    setSearchResults(filteredResults);
  }, [searchTerm, selectedSeries, selectedEscola, selectedTurno, publis]);

  const seriesOptions = [
    { value: '5', label: '5° Fundamental' },
    { value: '6', label: '6° Fundamental' },
    { value: '7', label: '7° Fundamental' },
    { value: '8', label: '8° Fundamental' },
    { value: '9', label: '9° Fundamental' },
    { value: '1', label: '1° Médio' },
    { value: '2', label: '2° Médio' },
    { value: '3', label: '3° Médio' },
  ];

  const escolasOptions = [
    { value: 'Escola 1', label: 'Colegio Centro 0' },
    { value: 'Centro de Ensino Fundamental 03 da Estrutural', label: '03 da Estrutural' },
  ];

  const turnoOptions = [
    { value: 'manha', label: 'Matutino' },
    { value: 'Vespertino', label: 'Vespertino' },
    { value: 'noite', label: 'Noturno' },
  ];

  return (
    <div className={styles.pagehome}>
     
      <div className={styles.container}>
        <div className="wellcomemobi">
          
        </div>
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
            value={selectedTurno}
            onChange={e => setSelectedTurno(e.target.value)}
            className={styles.select}
          >
            <option value="">Turno</option>
            {turnoOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
         <div className={styles.selects}>
          <select
            value={selectedSeries}
            onChange={(e) => setSelectedSeries(e.target.value)}
            className={styles.select}
          >
            <option value="">Série</option>
            {seriesOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          
          </div>
          <div className={styles.selectspdf}>
          <ImportAlunos />
          </div>
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
        

      {fetchError && (<p>{fetchError}</p>)}
      {searchResults && searchResults.length > 0 ? (
        <div className="grid-container">
          {searchResults.map(publi => (
            <PubliCards key={publi.id} publi={publi} />
          ))}
        </div>
      ) : (
        <p>Nenhum resultado encontrado.</p>
      )}
    </div>
  );
};

export default ListClass;
