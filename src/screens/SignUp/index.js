import React, { useContext, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { StyleContext } from "../../context/StyleContext";
import styles from './styles.module.css';
import { useNavigate } from "react-router-dom";
import Loading from "../../componets/Loading";


const SignUp = () => {
  const navigate = useNavigate();
  const {darkMode} = useContext(StyleContext);
  const { signUp, handleLoading } = useAuth(); // Assumindo que você tem uma função signUp no seu contexto de autenticação
 

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
   
  const handleSignin = () => {
    navigate('/signIn');
  };

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
     
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await signUp(email, password); // Chame a função de cadastro do seu contexto de autenticação
      // Limpar os campos após o cadastro
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setError(null); // Limpar qualquer erro anterior
      
      // Após o cadastro bem sucedido, você pode redirecionar o usuário ou mostrar uma mensagem de sucesso
    } catch (error) {
      setError("Erro ao cadastrar. Verifique os dados e tente novamente.");
      console.error("Erro ao cadastrar:", error);
    }
  };

  return (
    <main className={`${styles.signupContainer} ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      
      <div className={styles.signupForm}>
        <div className={styles.formGroup}>

          <label className={styles.labelcad}>Email:</label>
          
           <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}/>
        
        </div>
        <div className={styles.formGroup}>
        <label className={styles.labelcad}> Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
         
           <label className={styles.labelcad}>Confirmar Senha:</label> 
         
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

        </div>
       
         <div className={styles.formGroup}>
          {error && <p className={styles.errorMsg}>{error}</p>}
         
          <div className={styles.btnPrimary} onClick={handleSignUp}>
            Cadastrar
          </div>

          <div className={`${styles.btnTertiary} ${darkMode ? styles.darkbtn : '' }`} onClick={handleSignin}>
          Tem uma conta, faca login
          </div>

         
        </div>
      </div>
    </main>
  );
};

export default SignUp;
