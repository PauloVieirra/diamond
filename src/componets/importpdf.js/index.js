import React, { useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist/webpack';
import supabase from '../../servers/SupabaseConect';
import './style.css';

const ImportAlunos = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [rows, setRows] = useState([]);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleLimpar = () => {
    setPdfFile(null);
    setRows([]);
    setTitle('');
    setSubtitle('');
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

        const rowsData = [];
        let currentRow = {};

        // Ignorar as duas primeiras linhas do PDF e armazenar como título e subtítulo
        if (textContent.items.length > 0) {
          setTitle(textContent.items[0].str.trim()); // Primeiro título
          setSubtitle(textContent.items[1].str.trim()); // Segundo título
        }

        textContent.items.forEach((item, index) => {
          const str = item.str.trim();

          // Ignorar as duas primeiras linhas
          if (index < 12) return;

          switch ((index - 2) % 7) {
            case 0:
              currentRow.aluno_id = str; // Código
              break;
            case 1:
              currentRow.name = str; // Nome do Estudante/Nome Social
              break;
            case 2:
              currentRow.birthDate = str; // Dt Nasc
              break;
            case 3:
              currentRow.age = str; // Idade
              break;
            case 4:
              currentRow.anee = str; // ANEE
              break;
            case 5:
              currentRow.phone = str; // Telefone
              break;
            case 6:
              currentRow.guardian = str; // Nome do Responsável
              rowsData.push(currentRow); // Adiciona a linha completa
              currentRow = {}; // Reseta o objeto para a próxima linha
              break;
            default:
              break;
          }
        });

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
        .select('aluno_id, name, birthDate, age, anee, phone');

      if (fetchError) {
        console.error('Erro ao buscar dados existentes:', fetchError);
        setStatusMessage('Erro ao buscar dados existentes.');
        return;
      }

      const newAlunos = rows.filter(row =>
        !existingAlunos.some(aluno =>
          aluno.aluno_id === row.aluno_id &&
          aluno.name === row.name &&
          aluno.birthDate === row.birthDate &&
          aluno.age === row.age &&
          aluno.anee === row.anee &&
          aluno.phone === row.phone
        )
      );

      if (newAlunos.length === 0) {
        setStatusMessage('Nenhum novo aluno para inserir.');
        return;
      }

      const { data: insertedAlunos, error: insertError } = await supabase
        .from('alunos')
        .insert(newAlunos, { returning: 'minimal' });

      if (insertError) {
        console.error('Erro ao inserir dados:', insertError);
        setStatusMessage('Erro ao inserir dados.');
      } else {
        console.log('Dados inseridos com sucesso:', insertedAlunos);
        setStatusMessage('Dados inseridos com sucesso.');
        setRows([]); // Limpa os dados após a submissão
      }
    } catch (error) {
      console.error('Erro ao enviar dados:', error);
      setStatusMessage('Erro ao enviar dados.');
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
          <h2>{title}</h2>
          <h3>{subtitle}</h3>
         <div className='contimportsbtns'>
          <button className='btnconfirm' onClick={handleConfirm}>Confirmar Envio</button>
          <button className='btnlimpar' onClick={handleLimpar}>Cancelar</button>
        </div>
          {rows.length > 0 && (
            <>
              <h2>Dados extraídos:</h2>
              <table>
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Nome do Estudante/Nome Social</th>
                    <th>Dt Nasc / Idade</th>
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
                      <td>{row.birthDate} / {row.age}</td>
                      <td>{row.anee}</td>
                      <td>{row.phone}</td>
                      <td>{row.guardian}</td>
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
