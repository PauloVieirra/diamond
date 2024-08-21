import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import supabase from "../servers/SupabaseConect";
import "./style.css";

const PubliCards = ({ publi }) => {
  const [showPercents, setShowPercents] = useState('0.00');

  useEffect(() => {
    const fetchPercentual = async () => {
      // Fetch percentual from 'bimestre_1' table
      const { data, error } = await supabase
        .from('bimestre_1')
        .select('percentual')
        .eq('aluno_id', publi.id)
        .single(); // Assuming 'id' is unique

      if (error) {
        console.error("Erro ao buscar percentual:", error);
      } else {
        // Ensure the percentual value is a number and format it to two decimal places
        const percentualValue = parseFloat(data?.percentual) || 0;
        const formattedPercentual = percentualValue.toFixed(2);
        setShowPercents(formattedPercentual);
      }
    };

    fetchPercentual();
  }, [publi.id]);

  return (
    <div className="containercards">
      <div className="cardalunos">
        <div className="cardinto">
          <h3 style={{ fontSize: '18px', fontWeight: '600' }}>{publi.name}</h3>
        </div>
        <div className="cardinto">
          <div className="cardintorow">
            <div style={{ fontSize: '18px', fontWeight: '500' }}>
              {showPercents}%
            </div>
            <div style={{ fontSize: '18px' }}></div>
          </div>
          <div className="cardinto"></div>
        </div>
        <div className="linebooton">
          <Link to={"/Ravform/" + publi.id}>
            <div className="button-edit">Editar</div>
          </Link>
          <Link to={{ pathname: "/RavGerador/" + publi.id }}>
            <div className="button-gerar">Gerar Rav</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PubliCards;
