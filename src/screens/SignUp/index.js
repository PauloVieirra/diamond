import React, { useContext, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { StyleContext } from "../../context/StyleContext";
import styles from './styles.module.css';
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const { darkMode } = useContext(StyleContext);
  const { signUp, login, isLoading } = useAuth(); // Assumindo que você tem uma função signUp e login no seu contexto de autenticação

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSignin = () => {
    navigate('/signIn');
  };

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      setSuccess(null);
      return;
    }

    try {
      setError(null);
      setSuccess(null);
      const { user, error: signUpError } = await signUp(email, password);

      if (signUpError) {
        setError("Erro ao cadastrar. Verifique os dados e tente novamente.");
        console.error("Erro ao cadastrar:", signUpError);
        return;
      }

      // Após o cadastro, faça login automático
      const { user: loginUser, error: loginError } = await login(email, password);
      if (loginError) {
        setError("Erro ao fazer login após o cadastro. Tente novamente.");
        console.error("Erro ao fazer login:", loginError);
        return;
      }

      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setSuccess("Cadastro realizado com sucesso. Você está agora logado.");
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
          <label className={styles.labelcad}>Confirmar Senha:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          {error && <p className={styles.errorMsg}>{error}</p>}
          {success && <p className={styles.successMsg}>{success}</p>}
          <div className={styles.btnPrimary} onClick={handleSignUp}>
            Cadastrar
          </div>
          <div className={`${styles.btnTertiary} ${darkMode ? styles.darkbtn : ''}`} onClick={handleSignin}>
            Tem uma conta? Faça login
          </div>
        </div>
      </div>
    </main>
  );
};

export default SignUp;
