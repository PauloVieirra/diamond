import React, { useEffect, useState } from 'react';
import supabase from '../../servers/SupabaseConect';
import './styles.css'; // Certifique-se de que o caminho para o CSS está correto

const Dashboard = () => {
  const [stats, setStats] = useState({
    professores: 0,
    alunos: 0,
    pagantesEmDia: 0,
    pagantesEmAtraso: 0,
    contasAtivas: 0,
    contasInativas: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar quantidade de professores
        const { count: professoresCount, error: professoresError } = await supabase
          .from('professores')
          .select('*', { count: 'exact', head: true });
        
        if (professoresError) throw professoresError;

        // Buscar quantidade de alunos
        const { count: alunosCount, error: alunosError } = await supabase
          .from('alunos')
          .select('*', { count: 'exact', head: true });
        
        if (alunosError) throw alunosError;

        // Buscar quantidade de pagantes em dia
        const { count: pagantesEmDiaCount, error: pagantesEmDiaError } = await supabase
          .from('pagamentos')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'em dia');

        if (pagantesEmDiaError) throw pagantesEmDiaError;

        // Buscar quantidade de pagantes em atraso
        const { count: pagantesEmAtrasoCount, error: pagantesEmAtrasoError } = await supabase
          .from('pagamentos')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'atrasado');

        if (pagantesEmAtrasoError) throw pagantesEmAtrasoError;

        // Buscar quantidade de contas ativas
        const { count: contasAtivasCount, error: contasAtivasError } = await supabase
          .from('contas')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'ativa');

        if (contasAtivasError) throw contasAtivasError;

        // Buscar quantidade de contas inativas
        const { count: contasInativasCount, error: contasInativasError } = await supabase
          .from('contas')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'inativa');

        if (contasInativasError) throw contasInativasError;

        setStats({
          professores: professoresCount || 0,
          alunos: alunosCount || 0,
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

  return (
    <div className="containerdash"> 
      <div className="dashboard">
        <div className="row">
          <h1>Dashboard</h1>   
        </div>
        <div className="dashboard-card">
          <h2>Professores</h2>
          <p>{stats.professores}</p>
        </div>
        <div className="dashboard-card">
          <h2>Alunos</h2>
          <p>{stats.alunos}</p>
        </div>
        <div className="dashboard-card">
          <h2>Pagantes em Dia</h2>
          <p>{stats.pagantesEmDia}</p>
        </div>
        <div className="dashboard-card">
          <h2>Pagantes em Atraso</h2>
          <p>{stats.pagantesEmAtraso}</p>
        </div>
        <div className="dashboard-card">
          <h2>Contas Ativas</h2>
          <p>{stats.contasAtivas}</p>
        </div>
        <div className="dashboard-card">
          <h2>Contas Inativas</h2>
          <p>{stats.contasInativas}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
