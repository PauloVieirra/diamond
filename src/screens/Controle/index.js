import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StyleContext } from '../../context/StyleContext';
import supabase from '../../servers/SupabaseConect';
import './styles.css'; // Certifique-se de que o caminho para o CSS está correto

const Dashboard = () => {
  const { darkMode } = useContext(StyleContext);

  const [stats, setStats] = useState({
    escolas: 0,
    professores: 0,
    alunos: 0,
    disciplinas: 0,
    assuntos: 0,
    desempenho: 0,
    pagantesEmDia: 0,
    pagantesEmAtraso: 0,
    contasAtivas: 0,
    contasInativas: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { count: professoresCount, error: professoresError } = await supabase
          .from('professores')
          .select('*', { count: 'exact', head: true });

        if (professoresError) throw professoresError;

        const { count: escolasCount, error: escolasError } = await supabase
          .from('escola')
          .select('*', { count: 'exact', head: true });

        if (escolasError) throw escolasError;

        const { count: disciplinasCount, error: disciplinasError } = await supabase
        .from('disciplinas')
        .select('*', { count: 'exact', head: true });

      if (disciplinasError) throw disciplinasError;

        const { count: alunosCount, error: alunosError } = await supabase
          .from('alunos')
          .select('*', { count: 'exact', head: true });

        if (alunosError) throw alunosError;

        const { count: assuntosCount, error: assuntosError } = await supabase
          .from('assuntos')
          .select('*', { count: 'exact', head: true });

        if (assuntosError) throw assuntosError;

        const { count: desempenhoCount, error: desempenhoError } = await supabase
          .from('retornomoderado')
          .select('*', { count: 'exact', head: true });

        if (desempenhoError) throw desempenhoError;

        const { count: pagantesEmDiaCount, error: pagantesEmDiaError } = await supabase
          .from('pagamentos')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'em dia');

        if (pagantesEmDiaError) throw pagantesEmDiaError;

        const { count: pagantesEmAtrasoCount, error: pagantesEmAtrasoError } = await supabase
          .from('pagamentos')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'atrasado');

        if (pagantesEmAtrasoError) throw pagantesEmAtrasoError;

        const { count: contasAtivasCount, error: contasAtivasError } = await supabase
          .from('contas')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'ativa');

        if (contasAtivasError) throw contasAtivasError;

        const { count: contasInativasCount, error: contasInativasError } = await supabase
          .from('contas')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'inativa');

        if (contasInativasError) throw contasInativasError;

        setStats({
          escolas: escolasCount || 0,
          professores: professoresCount || 0,
          alunos: alunosCount || 0,
          disciplinas: disciplinasCount || 0,
          assuntos: assuntosCount || 0,
          desempenho: desempenhoCount || 0,
          pagantesEmDia: pagantesEmDiaCount || 0,
          pagantesEmAtraso: pagantesEmAtrasoCount || 0,
          contasAtivas: contasAtivasCount || 0,
          contasInativas: contasInativasCount || 0,
        });
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error.message);
      }
    };

    fetchData();
  }, []);

  // Funções de navegação
  const goToProfessores = () => navigate('/Professores');
  const goToEscolas = () => navigate('/Escolas');
  const goToAlunos = () => navigate('/alunos');
  const goToDisciplinas = () => navigate('/Disciplina');
  const goToAssuntos = () => navigate('/Assuntos');
  const goToDesempenhos = () => navigate('/Desempenhos');
  const goToPagantesEmDia = () => navigate('/pagamentos/em-dia');
  const goToPagantesEmAtraso = () => navigate('/pagamentos/em-atraso');
  const goToContasAtivas = () => navigate('/contas/ativas');
  const goToContasInativas = () => navigate('/contas/inativas');

  return (
    <div className={`containerdash ${darkMode ? 'dark-mode' : ' '}`}>
      <div className="row-dash">
        <h1>Controle</h1>
      </div>
      <div className="dashboard">
        <div className="dashboard-card" onClick={goToProfessores}>
          <p>{stats.professores}</p>
          <h2>Professores</h2>
        </div>
        <div className="dashboard-card" onClick={goToEscolas}>
          <p>{stats.escolas}</p>
          <h2>Escolas</h2>
        </div>
        <div className="dashboard-card" onClick={goToAlunos}>
          <p>{stats.alunos}</p>
          <h2>Alunos</h2>
        </div>
        <div className="dashboard-card" onClick={goToDisciplinas}>
          <p>{stats.disciplinas}</p>
          <h2>Disciplinas</h2>
        </div>
        <div className="dashboard-card" onClick={goToAssuntos}>
          <p>{stats.assuntos}</p>
          <h2>Assuntos</h2>
        </div>
        <div className="dashboard-card" onClick={goToDesempenhos}>
          <p>{stats.desempenho}</p>
          <h2>Desempenho</h2>
        </div>
        <div className="dashboard-card" onClick={goToPagantesEmDia}>
          <p>{stats.pagantesEmDia}</p>
          <h2>Pagantes em Dia</h2>
        </div>
        <div className="dashboard-card" onClick={goToPagantesEmAtraso}>
          <p>{stats.pagantesEmAtraso}</p>
          <h2>Pagantes em Atraso</h2>
        </div>
        <div className="dashboard-card" onClick={goToContasAtivas}>
          <p>{stats.contasAtivas}</p>
          <h2>Contas Ativas</h2>
        </div>
        <div className="dashboard-card" onClick={goToContasInativas}>
          <p>{stats.contasInativas}</p>
          <h2>Contas Inativas</h2>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
