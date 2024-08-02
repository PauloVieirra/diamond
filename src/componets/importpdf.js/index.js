import React, { useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist/webpack';
import supabase from '../../servers/SupabaseConect';
import './style.css';

const ImportAlunos = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [rows, setRows] = useState([]);
  const [headerData, setHeaderData] = useState({});
  const [statusMessage, setStatusMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleLimpar = () => {
    setPdfFile(null);
    setRows([]);
    setHeaderData({});
    setStatusMessage('');
  };

  const handlePdfUpload = async (event) => {
    try {
      const file = event.target.files[0];
      setPdfFile(file);

      const reader = new FileReader();
      reader.onload = async function () {
        const typedArray = new Uint8Array(this.result);
        const pdfDoc = await pdfjsLib.getDocument({ data: typedArray }).promise;
        const firstPage = await pdfDoc.getPage(1);
        const textContent = await firstPage.getTextContent();
        console.log(textContent);

        const rowsData = [];
        let currentRow = {};
        let currentResponsavelLines = [];

        if (textContent.items.length > 0) {
          // Extrair valores para as colunas ignoradas
          const headerInfo = {
            Orgao: textContent.items[1].str.trim(),
            CRE: textContent.items[2].str.trim(),
            Instituicao: textContent.items[3].str.trim(),
            Data: textContent.items[3].str.trim(),
            Serie: textContent.items[8].str.trim(),
            Turno: textContent.items[10].str.trim().replace(/[^\p{L}\s]/gu, '')
          };

          setHeaderData(headerInfo);
        }

        textContent.items.forEach((item, index) => {
          const str = item.str.trim();

          if (index < 13) return;

          const isNewRow = !isNaN(str) && str !== '';

          if (isNewRow) {
            if (Object.keys(currentRow).length > 0) {
              if (currentResponsavelLines.length > 0) {
                const responsavelText = currentResponsavelLines.join(' ');
                const phoneOnly = responsavelText.replace(/[^\d()-]/g, '');
                const responsavelOnly = responsavelText.replace(/[^\p{L}\s]/gu, '');
                currentRow.phone = phoneOnly;
                currentRow.resposavel = responsavelOnly;
              }
              rowsData.push(currentRow);
            }
            currentRow = { aluno_id: str, name: '', birthDate: '', idade: '', anee: '', phone: '', resposavel: '' };
            currentResponsavelLines = [];
          } else {
            if (Object.keys(currentRow).length > 0) {
              if (!currentRow.name) {
                currentRow.name = str;
              } else if (!currentRow.birthDate && str.includes('/')) {
                currentRow.birthDate = str;
              } else if (!currentRow.idade) {
                currentRow.idade = str;
              } else if (!currentRow.anee) {
                currentRow.anee = str;
              } else if (!currentRow.resposavel) {
                if (str.match(/^\(\d{2}\) \d{5}-\d{4}/)) {
                  const parts = str.split(/(\(\d{2}\) \d{5}-\d{4})/).filter(Boolean);
                  if (parts.length === 2) {
                    currentRow.phone = parts[1].trim();
                    currentRow.resposavel = parts[0].trim();
                  } else {
                    currentResponsavelLines.push(str);
                  }
                } else {
                  currentResponsavelLines.push(str);
                }
              }
            }
          }
        });

        if (Object.keys(currentRow).length > 0) {
          if (currentResponsavelLines.length > 0) {
            const responsavelText = currentResponsavelLines.join(' ');
            const phoneOnly = responsavelText.replace(/[^\d()-]/g, '');
            const responsavelOnly = responsavelText.replace(/[^\p{L}\s]/gu, '');
            currentRow.phone = phoneOnly;
            currentRow.resposavel = responsavelOnly;
          }
          rowsData.push(currentRow);
        }

        setRows(rowsData);
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Erro ao processar o arquivo:', error);
      setStatusMessage('Erro ao processar o arquivo.');
    }
  };

  const handleConfirm = async () => {
    try {
      const { data: existingAlunos, error: fetchError } = await supabase
      .from('alunos')
      .select('aluno_id, name, birthDate, anee, phone, idade, resposavel');
  
      if (fetchError) {
        console.error('Erro ao buscar dados existentes:', fetchError);
        setStatusMessage('Erro ao buscar dados existentes. Verifique a conexão com o banco de dados.');
        return;
      }
  
      const alunosToInsert = rows.filter(row =>
       !existingAlunos.some(aluno =>
          aluno.aluno_id === row.aluno_id
        )
      );
  
      if (alunosToInsert.length === 0) {
        setStatusMessage('Nenhum novo aluno para inserir. Todos os alunos já existem no banco de dados.');
        return;
      }
  
      const insertPromises = alunosToInsert.map(aluno => {
        return supabase
        .from('alunos')
        .insert({
           aluno_id: aluno.aluno_id,
           name: aluno.name,
           birthDate: aluno.birthDate,
           anee: aluno.anee,
           phone: aluno.phone,
           idade: aluno.idade,
           resposavel: aluno.resposavel,
          ...headerData
         });
      });
  
      await Promise.all(insertPromises);
  
      console.log('Dados inseridos com sucesso!');
      setStatusMessage('Dados inseridos com sucesso!');
      setRows([]);
    } catch (error) {
      console.error('Erro ao enviar dados:', error);
      setStatusMessage('Erro ao enviar dados. Verifique a conexão com o banco de dados e tente novamente.');
    }
  };

  return (
    <div className="upBtnPdf">
      <input
        type="file"
        accept="application/pdf"
        onChange={handlePdfUpload}
        style={{ display: 'none' }}
        ref={fileInputRef}
      />
      {!pdfFile && (
        <div className='contbtnimport'>
          <button className='btnImports' onClick={() => fileInputRef.current.click()}>Selecionar arquivo PDF</button>
        </div>
      )}
      {pdfFile && <p>Arquivo carregado: {pdfFile.name}</p>}
     
      {pdfFile && (
        <div className='contModalAlunos'>
          <h2>{headerData.Orgao}</h2>
          <h3>{headerData.CRE}</h3>
          <h3>{headerData.Instituicao}</h3>
          <h3>{headerData.Serie}</h3>
          <h3>{headerData.Turno}</h3>
          <div className='contimportsbtns'>
            <button className='btnconfirm' onClick={handleConfirm}>Confirmar Envio</button>
            <button className='btnlimpar' onClick={handleLimpar}>Cancelar</button>
          </div>
          <div>
          {statusMessage && (
            <p style={{ color: 'red' }}>{statusMessage}</p>
          )}
            </div>
          {rows.length > 0 && (
            <>
              <h2>Dados extraídos:</h2>
              <table>
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Nome do Estudante/Nome Social</th>
                    <th>Dt Nasc</th>
                    <th>ANEE</th>
                    <th>Telefone</th>
                    <th>Nome do Responsável</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      <td>{row.aluno_id}</td>
                      <td>{row.name}</td>
                      <td>{row.birthDate} {row.idade}</td>
                      <td>{row.anee}</td>
                      <td>{row.phone}</td>
                      <td>{row.resposavel}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}
      {statusMessage && <p>{statusMessage}</p>}
    </div>
  );
};

export default ImportAlunos;
