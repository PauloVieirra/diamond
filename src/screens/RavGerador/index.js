import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PDFDocument, rgb } from 'pdf-lib';
import html2canvas from "html2canvas";
import supabase from "../../servers/SupabaseConect";
import './style.css';

const RavGerador = () => {
  const { id } = useParams();
  const [publi, setPubli] = useState(null);
  const [bimestreData, setBimestreData] = useState(null);
  const [relatorioData, setRelatorioData] = useState(null);
  const [resumoData, setResumoData] = useState(null);
  const [disciplinas, setDisciplinas] = useState({});
  const [assuntos, setAssuntos] = useState({});
  const [location, setLocation] = useState(null);
  const [dateTime, setDateTime] = useState({ day: '', month: '', year: '' });
  const [city, setCity] = useState('');

  useEffect(() => {
    // Recuperar data
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1; // Meses são indexados a partir de 0
    const year = now.getFullYear();
    setDateTime({ day, month, year });

    // Recuperar localização
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;

        // Usar um serviço externo para converter coordenadas em cidade
        fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
          .then(response => response.json())
          .then(data => {
            setCity(data.city || 'Desconhecida');
          })
          .catch(error => {
            console.error('Erro ao recuperar cidade:', error);
            setCity('Desconhecida');
          });
      }, (error) => {
        console.error('Erro ao obter localização:', error);
        setCity('Desconhecida');
      });
    }
  }, []);

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

  const generatePdf = async () => {
    // Seleciona o elemento com a classe "container" para captura
    const content = document.querySelector(".container");
  
    // Adiciona uma margem inferior generosa para garantir que todo o conteúdo seja capturado
    const marginBottom = 200; // Margem inferior em pixels
    content.style.position = 'relative';
    content.style.paddingBottom = `${marginBottom}px`; // Adiciona padding inferior
  
    // Captura o conteúdo completo com html2canvas
    const canvas = await html2canvas(content, {
      scale: 2,  // Aumenta a escala para melhorar a qualidade da imagem no PDF
      useCORS: true,
      scrollX: 0,
      scrollY: 0,
      windowWidth: content.scrollWidth,
      windowHeight: content.scrollHeight + marginBottom, // Adiciona a margem à altura da janela
    });
  
    const imgData = canvas.toDataURL("image/png");
    const pdfDoc = await PDFDocument.create();
  
    // Define a largura A4 padrão em pontos
    const pageWidth = 595.28; 
    const aspectRatio = canvas.width / canvas.height;
  
    // Calcula a altura da página para manter a proporção da imagem
    const scaledWidth = pageWidth;
    const scaledHeight = scaledWidth / aspectRatio;
  
    // Cria uma nova página com altura ajustada ao conteúdo
    const page = pdfDoc.addPage([pageWidth, scaledHeight]);
  
    // Insere a imagem na página com a altura ajustada
    const img = await pdfDoc.embedPng(imgData);
    page.drawImage(img, {
      x: 0,
      y: 0,
      width: scaledWidth,
      height: scaledHeight,
    });
  
    // Gera e baixa o PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `relatorio_${id}.pdf`;
    link.click();
  
    // Remove a margem inferior temporária
    content.style.paddingBottom = '';  // Remove o padding inferior
    content.style.position = '';       // Restaura a posição original
  };
  
  
  
  

  return (
    <div className="contgerar">
      <div> 
      <button onClick={generatePdf}>Gerar PDF</button> {/* Botão no topo */}
      </div>
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

          <div className="conttablegeral">
            <div className="conttable">
              <div className="table-row1">
                <div className="table-cell">A</div>
              </div>

              <div className="contcolumm">
                <div className="contlinestable">
                  <div className="line">
                   <div className="lineinto"> Ano Letivo: {publi.Data} </div>
                  </div>
                  <div className="line">
                  <div className="lineinto"> Coordenação Regional de Ensino: {publi.CRE} </div>
                  </div>
                  <div className="line">
                  <div className="lineinto">  Unidade Escolar: {publi.Instituicao} </div>
                  </div>
                  <div className="line">
                  <div className="lineinto">  Registro: {publi.Diaregistro} </div>
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
                      Adequação: {publi.adequacao ? "Sim" : "Não"}
                    </div>
                    <div className="contint">
                      Temporalidade: {publi.temporalidade ? "Sim" : "Não"}
                    </div>
                    <div className="contint">
                      Sala de recursos: {publi.saladerecursos ? "Sim" : "Não"}
                    </div>
                    <div className="contint">
                      Aplicacao: {publi.aplicacao ? "Sim" : "Não"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="conttable">
              <div className="table-row1">
                <div className="table-cell">B</div>
              </div>
              <div className="contsecondcolum">
                {resumoData && resumoData.map((item, index) => (
                  <div key={index}>
                    Em {item.titulo}, {item.assunto} {item.avaliacao} {item.retorno}
                  </div>
                ))}
              </div>
            </div>
            <div className="conttable">
            <div className="table-row1">
                <div className="table-cell">C</div>
            </div>
            <div className="contsecondcolum" style={{width:'100%'}}>
               <div className="contint"> Local/Data: {"Brasília"}    {dateTime.day}/{dateTime.month}/{dateTime.year} </div>
              </div>
            </div>
            <div className="conttable">
            <div className="table-row1">
                <div className="table-cell">D</div>
            </div>
            <div style={{width:'100%'}}>
                <div className="line">
                <div className="line" style={{display:'flex',border:'none', justifyContent:'center',alignItems:'flex-end', height:'50px'}}>
                 Assinatura/Matrícula do(a) Professor(a)
                </div>
                <div className="line" style={{display:'flex',borderRight:'none',borderBottom:'none',alignItems:'flex-end', justifyContent:'center', height:'50px'}}>
                Assinatura/Matrícula do(a) Professor(a)
                </div>
                </div>
                <div className="line">
                <div className="line" style={{display:'flex',border:'none', justifyContent:'center',alignItems:'flex-end', height:'50px'}}>
                Assinatura/Matrícula do(a) Professor(a)
                </div>
                <div className="line" style={{display:'flex',borderRight:'none',borderBottom:'none',alignItems:'flex-end', justifyContent:'center', height:'50px'}}>
                Assinatura/Matrícula do(a) Coordenador(a)
Pedagógico
                </div>
                </div>
                <div className="line">
                <div className="line" style={{display:'flex',border:'none', justifyContent:'center',alignItems:'flex-end', height:'50px'}}>
                Assinatura/Matrícula do(a) Professor(a)
                </div>
                <div className="line" style={{display:'flex',borderRight:'none',borderBottom:'none',alignItems:'flex-end', justifyContent:'center', height:'50px'}}>
                Assinatura/Matrícula do(a) Professor(a)
                </div>
                </div>
                </div>
             </div>
             <div className="conttable">
              <div className="table-row1">
                <div className="table-cell">E</div>
              </div>
              <div className="contsecondcolum" style={{width:"100%"}}>
                  <div style={{display:'flex', alignItems:'center', justifyContent:'center',width:"100%", margin:'20px'}}>Resultado Final (Preencher somente ao final do 4º bimestre)</div>
                  <div style={{width:"100%"}}>
                    ( x ) Cursando ( ) Progressão Continuada ( ) Avanço das Aprendizagens-Correção de
                  Fluxo  ( ) Aprovado ( ) Reprovado ( )Abandono   </div>
                  <div style={{width:"100%"}}>
                  

                  </div>
              </div>
            </div>
            <div className="conttable">
              <div className="table-row1">
                <div className="table-cell">F</div>
              </div>
              <div className="contsecondcolum" style={{width:"100%", padding:'10px'}}>
              Orientações: Professor(a), ao elaborar o Registro de Avaliação do 2º Ciclo (RAv) é importante considerar a descrição do
processo de aprendizagem do estudante, conforme as DIRETRIZES DE AVALIAÇÃO (2014, p. 49) que assim dispõe: “é
precisoque o mesmo contenha elementos da avaliação diagnóstica observados pelo docente e/ou pelo Conselho de Classe:
asaprendizagens evidenciadas e as dificuldades percebidas devem ser descritas na primeira parte do documento. Em seguida,
deve-
                  <div style={{width:"100%"}}>
                  

                  </div>
              </div>
            </div>

            {bimestreData && bimestreData.map((item, index) => (
              <div key={index}>
                <p>{item.disciplina} {item.nota}</p>
              </div>
            ))}

          </div>
        </div>
      ) : (
        <p>Carregando...</p>
      )}
    </div>
  );
};

export default RavGerador;
