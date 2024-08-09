import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PDFDocument, rgb } from 'pdf-lib';
import { saveAs } from 'file-saver';
import supabase from "../../servers/SupabaseConect";
import './style.css';

const PAGE_MARGIN = 50;
const FONT_SIZE = 12;

const RavGerador = () => {
  const { id } = useParams();
  const [publi, setPubli] = useState(null);
  const [bimestreData, setBimestreData] = useState(null);
  const [relatorioData, setRelatorioData] = useState(null);
  const [resumoData, setResumoData] = useState(null);
  const [disciplinas, setDisciplinas] = useState({});
  const [assuntos, setAssuntos] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: alunoData, error: alunoError } = await supabase
          .from("alunos")
          .select("*, Orgao, CRE, Diaregistro, Instituicao, Data, Serie, Turno, faltas, istea")
          .eq("id", id)
          .single();
  
        if (alunoError) throw alunoError;
        setPubli(alunoData);

        const { data: bimestreData, error: bimestreError } = await supabase
          .from("bimestre_1")
          .select("*")
          .eq("aluno_id", id);
  
        if (bimestreError) throw bimestreError;
        setBimestreData(bimestreData);
  
        const { data: relatorioData, error: relatorioError } = await supabase
          .from("relatorio_1")
          .select("*")
          .eq("aluno_id", id);
  
        if (relatorioError) throw relatorioError;
        setRelatorioData(relatorioData);
  
        const { data: resumoData, error: resumoError } = await supabase
          .from("resumo_1")
          .select("avaliacao, rendimento, retorno, disciplina_id, assunto_id")
          .eq("aluno_id", id);
  
        if (resumoError) throw resumoError;
        setResumoData(resumoData);

        const { data: disciplinasData, error: disciplinasError } = await supabase
          .from("disciplinas")
          .select("id, nome");
        
        if (disciplinasError) throw disciplinasError;
        const disciplinasMap = disciplinasData.reduce((acc, curr) => {
          acc[curr.id] = curr.nome;
          return acc;
        }, {});
        setDisciplinas(disciplinasMap);

        const { data: assuntosData, error: assuntosError } = await supabase
          .from("assuntos")
          .select("id, nome");
        
        if (assuntosError) throw assuntosError;
        const assuntosMap = assuntosData.reduce((acc, curr) => {
          acc[curr.id] = curr.nome;
          return acc;
        }, {});
        setAssuntos(assuntosMap);
  
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };
  
    fetchData();
  }, [id]);

  const addTextToPage = (page, text, x, y, fontSize, color) => {
    page.drawText(text, {
      x,
      y,
      size: fontSize,
      color,
    });
  };

  const generatePdf = async () => {
    if (publi) {
      const pdfDoc = await PDFDocument.create();
      let page = pdfDoc.addPage();
      let { width, height } = page.getSize();
      let currentY = height - PAGE_MARGIN;

      const addNewPage = () => {
        page = pdfDoc.addPage();
        ({ width, height } = page.getSize());
        currentY = height - PAGE_MARGIN;
      };

      addTextToPage(page, `Nome: ${publi.name}`, PAGE_MARGIN, currentY, FONT_SIZE, rgb(0, 0, 0));
      currentY -= FONT_SIZE + 5;
      addTextToPage(page, `Série: ${publi.Serie}`, PAGE_MARGIN, currentY, FONT_SIZE, rgb(0, 0, 0));
      currentY -= FONT_SIZE + 5;
      addTextToPage(page, `Turno: ${publi.Turno}`, PAGE_MARGIN, currentY, FONT_SIZE, rgb(0, 0, 0));
      currentY -= FONT_SIZE + 5;
      addTextToPage(page, `Faltas: ${publi.faltas}`, PAGE_MARGIN, currentY, FONT_SIZE, rgb(0, 0, 0));
      currentY -= FONT_SIZE + 5;
      addTextToPage(page, `Orgão: ${publi.Orgao}`, PAGE_MARGIN, currentY, FONT_SIZE, rgb(0, 0, 0));
      currentY -= FONT_SIZE + 5;
      addTextToPage(page, `CRE: ${publi.CRE}`, PAGE_MARGIN, currentY, FONT_SIZE, rgb(0, 0, 0));
      currentY -= FONT_SIZE + 5;
      addTextToPage(page, `Data de Registro: ${publi.Diaregistro}`, PAGE_MARGIN, currentY, FONT_SIZE, rgb(0, 0, 0));
      currentY -= FONT_SIZE + 5;
      addTextToPage(page, `Instituição: ${publi.Instituicao}`, PAGE_MARGIN, currentY, FONT_SIZE, rgb(0, 0, 0));
      currentY -= FONT_SIZE + 5;
      addTextToPage(page, `Data: ${publi.Data}`, PAGE_MARGIN, currentY, FONT_SIZE, rgb(0, 0, 0));
      currentY -= FONT_SIZE + 5;
      addTextToPage(page, `ISTEA: ${publi.istea ? 'Sim' : 'Não'}`, PAGE_MARGIN, currentY, FONT_SIZE, rgb(0, 0, 0));
      currentY -= FONT_SIZE + 10;

      addTextToPage(page, 'Notas de Desempenho:', PAGE_MARGIN, currentY, FONT_SIZE, rgb(0, 0, 0));
      currentY -= FONT_SIZE + 10;

      if (bimestreData) {
        bimestreData.forEach((item, index) => {
          if (currentY < PAGE_MARGIN) addNewPage();
          addTextToPage(page, `${item.disciplina}: ${item.nota}`, PAGE_MARGIN, currentY, FONT_SIZE, rgb(0, 0, 0));
          currentY -= FONT_SIZE + 5;
        });
      }

      addTextToPage(page, 'Relatório:', PAGE_MARGIN, currentY, FONT_SIZE, rgb(0, 0, 0));
      currentY -= FONT_SIZE + 10;

      if (relatorioData) {
        relatorioData.forEach((item, index) => {
          if (currentY < PAGE_MARGIN) addNewPage();
          addTextToPage(page, `Relatório ${index + 1}: ${item.resumo}`, PAGE_MARGIN, currentY, FONT_SIZE, rgb(0, 0, 0));
          currentY -= FONT_SIZE + 5;
        });
      }

      addTextToPage(page, 'Resumo:', PAGE_MARGIN, currentY, FONT_SIZE, rgb(0, 0, 0));
      currentY -= FONT_SIZE + 10;

      if (resumoData) {
        resumoData.forEach((item, index) => {
          const disciplinaNome = disciplinas[item.disciplina_id] || 'Desconhecida';
          const assuntoNome = assuntos[item.assunto_id] || 'Desconhecido';

          if (currentY < PAGE_MARGIN) addNewPage();
          addTextToPage(page, `Título: ${disciplinaNome}`, PAGE_MARGIN, currentY, FONT_SIZE, rgb(0, 0, 0));
          currentY -= FONT_SIZE + 5;

          addTextToPage(page, `Assunto: ${assuntoNome}`, PAGE_MARGIN, currentY, FONT_SIZE, rgb(0, 0, 0));
          currentY -= FONT_SIZE + 5;

          addTextToPage(page, `Avaliação: ${item.avaliacao}, Rendimento: ${item.rendimento}`, PAGE_MARGIN, currentY, FONT_SIZE, rgb(0, 0, 0));
          currentY -= FONT_SIZE + 5;

          addTextToPage(page, `Resumo: ${item.retorno}`, PAGE_MARGIN, currentY, FONT_SIZE, rgb(0, 0, 0));
          currentY -= FONT_SIZE + 10;
        });
      }

      const pdfBytes = await pdfDoc.save();
      saveAs(new Blob([pdfBytes], { type: 'application/pdf' }), 'relatorio.pdf');
    }
  };

  return (
    <div className="contgerar">
    {publi ? (
      <div>
        <h1>Boletim de {publi.name}</h1>
        <p>Série: {publi.Serie}</p>
        <p>Turno: {publi.Turno}</p>
        <p>Faltas: {publi.faltas}</p>
        <p>Orgão: {publi.Orgao}</p>
        <p>CRE: {publi.CRE}</p>
        <p>Data de Registro: {publi.Diaregistro}</p>
        <p>Instituição: {publi.Instituicao}</p>
        <p>Data: {publi.Data}</p>
        <p>TEA ou PDC: {publi.istea ? 'Sim' : 'Não'}</p>
        <h2>Notas de Desempenho:</h2>
        {bimestreData && bimestreData.map((item, index) => (
          <div key={index}>
            <p>{item.disciplina}: {item.nota}</p>
          </div>
        ))}
        <h2>Relatório</h2>
        {relatorioData && relatorioData.map((item, index) => (
          <div key={index}>
            <p>Relatório {index + 1}: {item.resumo}</p>
          </div>
        ))}
        <h2>Resumo</h2>
        {resumoData && resumoData.map((item, index) => (
          <div key={index}>
            <p>Título: {item.titulo}</p>
            <p>Assunto: {item.assunto}</p>
            <p>Avaliação: {item.avaliacao}</p>
            <p>Rendimento: {item.rendimento}</p>
            <p>Resumo: {item.retorno}</p>
          </div>
        ))}
        <button onClick={generatePdf}>Gerar PDF</button>
      </div>
    ) : (
      <p>Carregando...</p>
    )}
  </div>
  );
};

export default RavGerador;
