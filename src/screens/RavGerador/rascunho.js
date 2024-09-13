



import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { PDFDocument, rgb } from 'pdf-lib';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from "html2canvas";
import supabase from "../../servers/SupabaseConect";
import './style.css';

const RavGeradortester = () => {
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
  const [professorName, setProfessorName] = useState("");
  const {user } = useAuth();
  const anoAtual = new Date().getFullYear();

  useEffect(() => {
    const fetchProfessorName = async () => {
      try {
        // Certifique-se de que user.uid é um texto que corresponde ao campo uid na tabela
        const { data: professorData, error: professorError } = await supabase 
          .from("professores")
          .select("nome")  // Nome da coluna que contém o nome do professor
          .eq("uid", user.id)  // Usando user.id como uid para buscar na coluna uid
          .single();  // Use single() para garantir que você recebe apenas um resultado
  
        if (professorError) throw professorError;
  
        setProfessorName(professorData?.nome);  // Atualize o estado com o nome do professor
      } catch (error) {
        console.error('Erro ao buscar nome do professor:', error);
      }
    };
  
    if (user.id) {  // Verifique se user.id está disponível antes de fazer a consulta
      fetchProfessorName();
    }
  }, [user.id]);  // Refaça a busca sempre que user.id mudar

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

  const generatePDF = () => {
    const doc = new jsPDF();
  
    // Adiciona o cabeçalho
    doc.autoTable({
      head: [['Cabeçalho Único', '']],
      startY: 20, // Ajuste a posição inicial para não sobrepor o cabeçalho
      theme: 'striped',
      styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0.5, lineColor: [0, 0, 0] }
    });
  
    // Adiciona o conteúdo da tabela
    doc.autoTable({
      head: [['Coluna 1', 'Coluna 2']],
      body: [
        ['A', '12\nConteúdo Linha 3\nConteúdo Linha 4\nConteúdo Linha 5\nConteúdo Linha 6\nConteúdo Linha 7\nConteúdo Linha 8\nConteúdo Linha 9\nConteúdo Linha 10\nConteúdo Linha 11\nConteúdo Linha 12\nConteúdo Linha 13\nConteúdo Linha 14\nConteúdo Linha 15'],
        ['Data 1', 'Conteúdo Linha 2'],
        ['Data 2', 'Conteúdo Linha 3'],
        ['Data 3', 'Conteúdo Linha 4'],
        ['Data 4', 'Conteúdo Linha 5'],
        ['Data 5', 'Conteúdo Linha 6']
      ],
      startY: doc.autoTable.previous.finalY + 10, // Ajusta a posição inicial para não sobrepor o cabeçalho
      theme: 'striped',
      styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0.5, lineColor: [0, 0, 0] },
      columnStyles: { 0: { cellWidth: 10 }, 1: { cellWidth: 160 } }
    });
  
    doc.save('table.pdf');
  };
  
  
  return (
    <div className="contgerar">
      <div className="testetabela">

      <table id="my-table" className="table-bordered" style={{ width: '100%', tableLayout: 'fixed' }}>
  <colgroup>
    <col style={{ width: '30px' }} />
    <col style={{ width: 'calc(100% - 30px)' }} />
  </colgroup>
  <thead>
      <tr>
        <th colSpan="2" style={{ border: '1px solid #000', textAlign: 'center' }}>
          Cabeçalho Único
        </th>
      </tr>
    </thead>
  <tbody>
    
    <tr >
        <td style={{ maxWidth:'50px'}}>A</td>
    <td>
  
    <table style={{ width: '100%', maxWidth: '700px', borderCollapse: 'collapse' }}>
      <tbody>
      <tr>
    
      
       
          <div style={{ borderBottom: '1px solid #000' }}>1</div>
          <div style={{ borderBottom: '1px solid #000' }}>2</div>
          <div style={{ borderBottom: '1px solid #000' }}>Conteúdo Linha 3</div>
          <div style={{ borderBottom: '1px solid #000' }}>Conteúdo Linha 4</div>
          <div style={{ borderBottom: '1px solid #000' }}>Conteúdo Linha 5</div>
          <div style={{ borderBottom: '1px solid #000' }}>Conteúdo Linha 6</div>
          <div style={{ borderBottom: '1px solid #000' }}>Conteúdo Linha 7</div>
          <div style={{ borderBottom: '1px solid #000' }}>Conteúdo Linha 8</div>
          <div style={{ borderBottom: '1px solid #000' }}>Conteúdo Linha 9</div>
          <div style={{ borderBottom: '1px solid #000' }}>Conteúdo Linha 10</div>
          <div style={{ borderBottom: '1px solid #000' }}>Conteúdo Linha 11</div>
          <div style={{ borderBottom: '1px solid #000' }}>Conteúdo Linha 12</div>
          <div style={{ borderBottom: '1px solid #000' }}>Conteúdo Linha 13</div>
          <div style={{ borderBottom: '1px solid #000' }}>Conteúdo Linha 14</div>
          <div style={{ borderBottom: '1px solid #000' }}>Conteúdo Linha 15</div>
      
    
    </tr>
      </tbody>
    </table>
  </td>
</tr>

    
    {/* Linhas adicionais (2 a 6) */}
    <tr>
      <td>Data 1</td>
      <td style={{flex:1, flexDirection:'column'}}>
        <td>
          1
        </td>
        <td>
          2
        </td>
      </td>
      
    </tr>
    <tr>
      <td>Data 2</td>
      <td>Conteúdo Linha 3</td>
    </tr>
    <tr>
      <td>Data 3</td>
      <td>Conteúdo Linha 4</td>
    </tr>
    <tr>
      <td>Data 4</td>
      <td>Conteúdo Linha 5</td>
    </tr>
    <tr>
      <td>Data 5</td>
      <td>Conteúdo Linha 6</td>
    </tr>
  </tbody>
</table>


  
</div>

      <div> 
      <button onClick={generatePDF}>Gerar PDF</button> {/* Botão no topo */}
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
                   <div className="lineinto"> Ano Letivo:  {anoAtual} </div>
                  </div>
                  <div className="line">
                  <div className="lineinto"> Coordenação Regional de Ensino: {publi.CRE} </div>
                  </div>
                  <div className="line">
                  <div className="lineinto">  Unidade Escolar: {publi.Instituicao} </div>
                  </div>
                  <div className="line">
                  <div className="lineinto">
                    Bloco: {" "}
                          {publi.bloco === true
                            ? "1º Bloco ( ) 2º Bloco (x)"
                            : "1º Bloco (x) 2º Bloco ( )"}
                          <br />
                   </div>
                  </div>
                  <div className="line">
                  <div className="lineintoitem">  Ano: {publi.Curso} </div> 
                  <div className="lineintoitem">  Turma: {publi.Turma} </div>
                  <div className="lineinto">
                      Turno: {" "}
                      {publi.Turno === " Matutino" 
                        ? "( x ) Matutino  ( ) Vespertino  ( ) Integral"
                        : publi.Turno === " Vespertino"
                        ? "( ) Matutino  ( x ) Vespertino  ( ) Integral"
                        : publi.Turno === " Integral"
                        ? "( ) Matutino  ( ) Vespertino  ( x ) Integral"
                        : "( ) Matutino  ( ) Vespertino  ( ) Integral" // Caso padrão se nenhum valor for igual
                      }
                      <br />
                    </div>
                  </div>
                  <div className="line">
                   <div className="lineinto">Professor(a) regente da turma: {professorName}</div> 
                  </div>
                  <div className="line">
                   <div className="lineinto">Professor(a)</div> 
                  </div>
                  <div className="line">
                   <div className="lineinto">Professor(a)</div> 
                  </div>
                  <div className="line">
                  <div className="lineinto">Estudante: {publi.name}</div>
                  </div>
                  <div className="line">
                    <div className="lineinto"> 
                  Apresenta Deficiência ou TEA?: {" "}
                          {publi.isTea === true
                            ? "(  ) não ( x ) sim"
                            : "( x ) não (  ) sim"}
                          <br />
                    </div>      
                   </div>
                   <div className="line">
                    <div className="lineinto"> 
                    Houve adequação curricular?: {" "}
                          {publi.adequacao === true
                            ? "(  ) não ( x ) sim"
                            : "( x ) não (  ) sim"}
                          <br />
                    </div>      
                   </div>
                   <div className="line">
                    <div className="lineinto"> 
                    Estudante indicado para temporalidade?: {" "}
                          {publi.adequacao === true
                            ? "(  ) não ( x ) sim"
                            : "( x ) não (  ) sim"}
                          <br />
                    </div>      
                   </div>
                   <div className="line">
                  <div className="lineinto">
                    Estudante do Programa SuperAção "setado" no Sistema de Gestão i-Educar?: {" "}
                    {publi.superacao
                      ? "(  ) não ( x ) sim"
                      : "( x ) não (  ) sim"}
                    <br />
                    <div className="lineinto">
                      
                      {publi.superacao === true && (
                        <div className="lineclean">
                          {publi.superacaomodelo === "Classe comum com atendimento personalizado." ? (
                            <>
                              ( x ) Classe Comum com atendimento personalizado
                              <br />
                              (  ) Turma SuperAção
                              <br />
                              (  ) Turma SuperAção Reduzida
                            </>
                          ) : publi.superacaomodelo === "Turma SuperAção" ? (
                            <>
                              (  ) Classe Comum com atendimento personalizado
                              <br />
                              ( x ) Turma SuperAção
                              <br />
                              (  ) Turma SuperAção Reduzida
                            </>
                          ) : publi.superacaomodelo === "Turma SuperAção Reduzida" ? (
                            <>
                              (  ) Classe Comum com atendimento personalizado
                              <br />
                              (  ) Turma SuperAção
                              <br />
                              ( x ) Turma SuperAção Reduzida
                            </>
                          ) : (
                            " " // Caso padrão se nenhum valor for igual
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                </div>
                
                <div className="line" style={{display:'flex', flexDirection:'column', alignItems:'flex-start'}}>
                  <div className="lineinto">
                    Foi aplicada a Organização Curricular específica do Programa Superação?
                  </div>
                      
                      {publi.aplicacao && (
                        <div style={{display:'flex', flexDirection:'row', width:'auto'}}>
                          {publi.superacaomodelo === true ? (
                            <div>
                              ( x ) sim
                              <br />
                              (  ) não
                              <br />
                              (  ) parcialmente
                            </div>
                          ) : publi.superacaomodelo === false ? (
                            <div>
                              (  ) sim
                              <br />
                              (  ) não
                              <br />
                              ( x ) parcialmente
                            </div>
                          ) : publi.superacaomodelo === "Turma SuperAção Reduzida" ? (
                            <div>
                              (  ) sim
                              <br />
                              (  ) não
                              <br />
                              ( x ) parcialmente
                            </div>
                          ) : (
                            " " // Caso padrão se nenhum valor for igual
                          )}
                        </div>
                      )}
                    </div>

                  <div className="line">
                    <div className="lineintoitem">
                      Bimestre 
                    </div>
                    <div className="lineintoitem">
                    Total de dias letivos:
                    </div>
                    <div className="lineintoitem">
                    Total de Faltas:{publi.faltas}
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
                  {item.retorno} {item.assunto} {item.avaliacao} 
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

export default RavGeradortester;

