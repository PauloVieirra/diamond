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
        const { count: professoresCount } = await supabase
          .from('professores')
          .select('*', { count: 'exact' });
        
        // Buscar quantidade de alunos
        const { count: alunosCount } = await supabase
          .from('alunos')
          .select('*', { count: 'exact' });
        
        // Buscar quantidade de pagantes em dia
        const { count: pagantesEmDiaCount } = await supabase
          .from('pagamentos')
          .select('*')
          .eq('status', 'em dia')
          .count();

        // Buscar quantidade de pagantes em atraso
        const { count: pagantesEmAtrasoCount } = await supabase
          .from('pagamentos')
          .select('*')
          .eq('status', 'atrasado')
          .count();

        // Buscar quantidade de contas ativas
        const { count: contasAtivasCount } = await supabase
          .from('contas')
          .select('*')
          .eq('status', 'ativa')
          .count();

        // Buscar quantidade de contas inativas
        const { count: contasInativasCount } = await supabase
          .from('contas')
          .select('*')
          .eq('status', 'inativa')
          .count();

        setStats({
          professores: professoresCount,
          alunos: alunosCount,
          pagantesEmDia: pagantesEmDiaCount,
          pagantesEmAtraso: pagantesEmAtrasoCount,
          contasAtivas: contasAtivasCount,
          contasInativas: contasInativasCount,
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
