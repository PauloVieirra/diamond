import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { StyleContext } from "../../context/StyleContext";

import styles from "./styles.module.css";

const SignIn = () => {
  const { darkMode } = useContext(StyleContext);
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        setError("Por favor, preencha todos os campos.");
        return;
      }

      await login(email, password);
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        setError("Usuário não encontrado. Por favor, verifique o email.");
      } else if (error.code === "auth/wrong-password") {
        setError("Senha incorreta. Por favor, tente novamente.");
      } else if (error.code === "auth/email-not-confirmed") {
        setError(
          "O email ainda não foi confirmado. Por favor, verifique sua caixa de entrada."
        );
      } else {
        setError(
          "Ocorreu um erro ao fazer login. Por favor, tente novamente mais tarde."
        );
      }
    }
  };

  const handleHome = () => {
    navigate("/SignUp");
  };

  return (
   
       <main className={`${styles.contsaignin} ${darkMode ? darkMode : ''}`}>
     
        <div className="cont_title"></div>
        <div>{error && <p>{error}</p>}</div>

       
          <div className={styles.signupForm}>
            <div className={styles.formGroup}>
              <label className={styles.labelcad}>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.labelcad}>Senha:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
         
            <div className={styles.formGroup}>
                <div className={styles.btnPrimary} onClick={handleLogin}>
                  Entrar
                </div>
             
                <div className={`${styles.btnTertiary} ${darkMode ? styles.formDark : " "}`} onClick={handleHome}>
                  Sem uma conta?, cadastre-se
                </div>
            </div>
          
          </div>
       
        <div className={styles.rodapeterms}>
         
            <div className={`${styles.btntext} ${darkMode ? '' : ''}`}>Termos</div>
          
        </div>
    
    </main>
  );
};

export default SignIn;
