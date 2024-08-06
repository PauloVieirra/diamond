import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ListClass from "../../componets/Classes";
import { useAuth } from "../../context/AuthContext";
import { StyleContext } from "../../context/StyleContext.js";
import { ModalComplit } from "../../componets/Modals/index.js";
import styles from './style.module.css';


export default function Home() {

  const { darkMode} = useContext(StyleContext);
  const { user, logout, fetchUser, complit, professor } = useAuth();
  const [nameuser, setNameUser] = useState('Usuario');
  

  useEffect(() => {
    // Ao montar o componente, verificar se o usuário está autenticado
    fetchUser();
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <main className={`app ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className={styles.container}>
      
        
          {user ?  (
            <div className="containergrid">
            
              <ListClass/>
              {complit === false &&
                <ModalComplit/>
              }
            </div>
          ) : (
            <p>Nenhum usuário logado atualmente..</p>
          )}
       
       
      </div>
    </main>
  );
}
