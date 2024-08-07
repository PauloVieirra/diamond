import React from "react";
import { Link } from "react-router-dom";
import "./style.css";

const PubliCards = ({ publi }) => {
  //console.log("Dados do Publi:", publi);
  //const percentual = publi.percentual; // Recebe o percentual do aluno
  //console.log(percentual);

  return (
    <div className="containercards">
      <div className="cardalunos">
        <div className="cardinto">
          <h3 style={{fontSize:'18px', fontWeight:'600'}}>{publi.name}</h3>
        </div>
        <div className="cardinto"> 
        <div className="cardintorow">

         <div style={{fontSize:'18px', fontWeight:'500'}}>Série:{}</div> <div style={{fontSize:'18px'}}></div>

        </div>

        <div className="cardinto">
        
        </div>

        </div>
        <div className="linebooton">
          <Link to={"/Ravform/" + publi.id}>
            <div className="button-edit">Editar</div>
          </Link>
          <Link to={{
            pathname: "/RavGerador/" + publi.id }}>
            <div className="button-gerar">Gerar Rav</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PubliCards;
