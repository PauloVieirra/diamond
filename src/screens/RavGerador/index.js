import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PDFDocument, rgb } from 'pdf-lib';
import { saveAs } from 'file-saver';
import supabase from "../../servers/SupabaseConect";
import './style.css';

const PAGE_MARGIN = 50; // Margem da página
const FONT_SIZE = 12; // Tamanho da fonte
const FONT_TITLE = 12; // Tamanho da fonte
const LINE_HEIGHT = FONT_SIZE + 5; // Altura da linha
const BLOCK_SPACING = LINE_HEIGHT * 2; // Espaço entre blocos de itens

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
    page.drawText(text || '', {
      x,
      y,
      size: fontSize,
      color,
      maxWidth: page.getWidth() - 2 * PAGE_MARGIN, // Limita a largura do texto
      lineHeight: LINE_HEIGHT // Ajuste a altura da linha se necessário
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
  
      const checkPageOverflow = (lineHeight) => {
        if (currentY - lineHeight < PAGE_MARGIN) {
          addNewPage();
        }
      };
  
      // Adiciona conteúdo ao PDF
      addTextToPage(page, `REGISTRO DE AVALIAÇÃO - RAv`, PAGE_MARGIN, currentY, FONT_SIZE, rgb(0, 0, 0));
      currentY -= LINE_HEIGHT + 10;
  
      addTextToPage(page, `Formulário 1: Descrição do Processo de Aprendizagem do Estudante`, PAGE_MARGIN, currentY, FONT_SIZE, rgb(0, 0, 0));
      currentY -= LINE_HEIGHT;
  
      addTextToPage(page, `Ensino Fundamental (Anos Iniciais)`, PAGE_MARGIN, currentY, FONT_SIZE, rgb(0, 0, 0));
      currentY -= LINE_HEIGHT + 20;
  
      if (publi) {
        addTextToPage(page, `Ano Letivo: ${publi.Data}`, PAGE_MARGIN, currentY, FONT_SIZE, rgb(0, 0, 0));
        currentY -= LINE_HEIGHT;
  
        addTextToPage(page, `Coordenação Regional de Ensino: ${publi.CRE}`, PAGE_MARGIN, currentY, FONT_SIZE, rgb(0, 0, 0));
        currentY -= LINE_HEIGHT;
  
        addTextToPage(page, `Unidade Escolar: ${publi.Instituicao}`, PAGE_MARGIN, currentY, FONT_SIZE, rgb(0, 0, 0));
        currentY -= LINE_HEIGHT;
  
        addTextToPage(page, `Registro: ${publi.Diaregistro}`, PAGE_MARGIN, currentY, FONT_SIZE, rgb(0, 0, 0));
        currentY -= LINE_HEIGHT;
  
        addTextToPage(page, `Nome do aluno(a): ${publi.name}`, PAGE_MARGIN, currentY, FONT_SIZE, rgb(0, 0, 0));
        currentY -= LINE_HEIGHT;
  
        addTextToPage(page, `Data de Nascimento: ${publi.birthDate}`, PAGE_MARGIN, currentY, FONT_SIZE, rgb(0, 0, 0));
        currentY -= LINE_HEIGHT;
  
        addTextToPage(page, `Série/Ano: ${publi.curso}`, PAGE_MARGIN, currentY, FONT_SIZE, rgb(0, 0, 0));
        currentY -= LINE_HEIGHT;
  
        addTextToPage(page, `Turno: ${publi.Turno}`, PAGE_MARGIN, currentY, FONT_SIZE, rgb(0, 0, 0));
        currentY -= LINE_HEIGHT;
  
        if (bimestreData) {
          addTextToPage(page, `Notas do Bimestre:`, PAGE_MARGIN, currentY, FONT_SIZE, rgb(0, 0, 0));
          currentY -= LINE_HEIGHT;
  
          bimestreData.forEach((item, index) => {
            checkPageOverflow(LINE_HEIGHT);
            addTextToPage(page, `${item.disciplina}: ${item.nota}`, PAGE_MARGIN, currentY, FONT_SIZE, rgb(0, 0, 0));
            currentY -= LINE_HEIGHT;
          });
        }
  
        currentY -= BLOCK_SPACING;
  
        addTextToPage(page, `Relatório:`, PAGE_MARGIN, currentY, FONT_SIZE, rgb(0, 0, 0));
        currentY -= LINE_HEIGHT;
  
        if (relatorioData) {
          relatorioData.forEach((item, index) => {
            checkPageOverflow(LINE_HEIGHT);
            addTextToPage(page, `Relatório ${index + 1}: ${item.resumo || ''}`, PAGE_MARGIN, currentY, FONT_SIZE, rgb(0, 0, 0));
            currentY -= LINE_HEIGHT;
          });
        }
  
        currentY -= BLOCK_SPACING;
  
        addTextToPage(page, `Resumo:`, PAGE_MARGIN, currentY, FONT_SIZE, rgb(0, 0, 0));
        currentY -= LINE_HEIGHT;
  
        if (resumoData) {
          let resumoText = resumoData.map(item => {
            const disciplinaNome = disciplinas[item.disciplina_id] || 'Desconhecida';
            const assuntoNome = assuntos[item.assunto_id] || 'Desconhecido';
            return `Em ${disciplinaNome}, sobre ${assuntoNome}, ${item.avaliacao || 'N/A'}, ${item.retorno || 'N/A'}`;
          }).join(' | ');
  
          addTextToPage(page, resumoText, PAGE_MARGIN, currentY, FONT_SIZE, rgb(0, 0, 0));
          currentY -= LINE_HEIGHT * 2; // Espaço adicional após o bloco
        }
      }
  
      const pdfBytes = await pdfDoc.save();
      saveAs(new Blob([pdfBytes], { type: 'application/pdf' }), `relatorio_${id}.pdf`);
    }
  };
  

  return (
    <div className="contgerar">
    {publi ? (
      <div className="container">
        <div className="conttop">
          <div className="contimg"><img className="img" alt="" src="../images/logogdf.png" /></div>
          <div className="titletop"> {publi.Orgao} </div>
        </div>
        <div className="conttopinit">
          REGISTRO DE AVALIAÇÃO - RAv
          <br />Formulário 1: Descrição do Processo de Aprendizagem do Estudante
          Ensino Fundamental
          <br />(Anos Iniciais)
        </div>
         <div className="cont">
        <div className="contline2">A</div>
        <div className="tabela">
          <div className="contline">
            
           
          <div className="line">
            Ano Letivo: {publi.Data}
          </div>
          <div className="line">
            Coordenação Regional de Ensino: {publi.CRE}
          </div>
          <div className="line">
            Unidade Escolar: {publi.Instituicao}
          </div>
          <div className="line">
            Registro: {publi.Diaregistro}
          </div>
          <div className="line">
            Nome do aluno(a): {publi.name}
          </div>
          <div className="line">
            Data de Nascimento: {publi.birthDate}
          </div>
          <div className="line">
            Série/Ano: {publi.curso}
          </div>
          <div className="line">
            Turno: {publi.Turno}
          </div>
          <div className="line">
            <div className="contint">
            Adequação:{publi.adequacao ? (
              <div style={{marginLeft:'8px'}}>Sim</div>
            ) : (
              <div style={{marginLeft:'8px'}}>Não</div>
            )}
             </div>
             <div className="contint">
            Temporalidade: {publi.temporalidade ? (
               <div style={{marginLeft:'8px'}}> Sim</div>
            ) : (
              <div style={{marginLeft:'8px'}}>Não</div>
            )}
             </div>
             <div className="contint">
            Sala de recursos: {publi.saladerecursos ? (
               <div style={{marginLeft:'8px'}}> Sim</div>
            ) : (
              <div style={{marginLeft:'8px'}}>Não</div>
            )}
             </div>
             <div className="contint">
            Aplicacao: {publi.aplicacao ? (
               <div style={{marginLeft:'8px'}}> Sim</div>
            ) : (
              <div style={{marginLeft:'8px'}}>Não</div>
            )}
            </div>
            </div>
             </div>
          </div>

          {bimestreData && bimestreData.map((item, index) => (
          <div key={index}>
            <p>{item.disciplina}: {item.nota}</p>
          </div>
        ))}
        
        
        {resumoData && resumoData.map((item, index) => (
          <div key={index}>
            <p>
             Em {item.titulo}
              ,{item.assunto}
               {item.avaliacao}
               {item.retorno}
            </p>
          </div>
        ))}
        </div>
        <button onClick={generatePdf}>Gerar PDF</button>
      </div>
    ) : (
      <p>Carregando...</p>
    )}
  </div>
  );
};

export default RavGerador;
