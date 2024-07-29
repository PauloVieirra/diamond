// src/screens/RavGerador.js

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PDFDocument, rgb } from 'pdf-lib';
import { saveAs } from 'file-saver';
import supabase from "../../servers/SupabaseConect";
import './style.css';

const RavGerador = () => {
  const { id } = useParams();
  const [publi, setPubli] = useState(null);

  useEffect(() => {
    const fetchPubli = async () => {
      const { data, error } = await supabase
        .from("alunos")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
      } else {
        setPubli(data);
      }
    };

    fetchPubli();
  }, [id]);

  const generatePdf = async () => {
    if (publi) {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      const fontSize = 12;

      page.drawText(`Nome: ${publi.name}`, {
        x: 50,
        y: height - 4 * fontSize,
        size: fontSize,
        color: rgb(0, 0, 0),
      });

      page.drawText(`Série: ${publi.serie}`, {
        x: 50,
        y: height - 6 * fontSize,
        size: fontSize,
        color: rgb(0, 0, 0),
      });

      page.drawText('Notas de Desempenho:', {
        x: 50,
        y: height - 8 * fontSize,
        size: fontSize,
        color: rgb(0, 0, 0),
      });

      // Adicionar notas de Matemática e Português
      page.drawText(`Matemática: ${publi.matematica}`, {
        x: 50,
        y: height - 10 * fontSize,
        size: fontSize,
        color: rgb(0, 0, 0),
      });

      page.drawText(`Português: ${publi.portugues}`, {
        x: 50,
        y: height - 12 * fontSize,
        size: fontSize,
        color: rgb(0, 0, 0),
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      saveAs(blob, 'Rav.pdf');
    }
  };

  return (
    <div className="contgerar">
      {publi ? (
        <div>
          <h1>Boletim de {publi.name}</h1>
          <p>Série: {publi.serie}</p>
          <h2>Notas de Desempenho:</h2>
          <ul>
            <li>Matemática: {publi.matematica}</li>
            <li>Português: {publi.portugues}</li>
          </ul>
          <button onClick={generatePdf}>Baixar PDF</button>
        </div>
      ) : (
        <p>Aluno não encontrado.</p>
      )}
    </div>
  );
};

export default RavGerador;
