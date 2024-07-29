import React, { useRef, useEffect, useContext } from 'react';
import { StyleContext } from '../../context/StyleContext';
import styles from './style.module.css'; // Importe o arquivo CSS para estilos

const SlidCards = () => {
  const { darkMode } = useContext(StyleContext);
  const sliderRef = useRef(null);

  // Função para ajustar o tamanho dos cards ao redimensionar a janela
  const adjustCardSize = () => {
    const slider = sliderRef.current;
    if (slider) {
      const cards = slider.querySelectorAll(`.${styles.card}`); // Use `styles.card` para referenciar a classe do CSS module
      const cardWidth = slider.clientWidth / 1.3;

      cards.forEach(card => {
        card.style.width = `${cardWidth}px`;
      });
    }
  };

  // Chama a função de ajuste quando a janela for redimensionada
  // Use useEffect para garantir que o ajuste seja feito inicialmente e ao redimensionar
  useEffect(() => {
    adjustCardSize();
    window.addEventListener('resize', adjustCardSize);
    return () => {
      window.removeEventListener('resize', adjustCardSize);
    };
  }, []);

  return (
    <div className={styles.slidercontainer} ref={sliderRef}>
      <div className={styles.sliders}>
        
        <div className={`${styles.cardrs} cardrs`}>
          <div className={`${styles.cardContents} contents`}>
            <img className={`${styles.cardImage} image`} src="images/280.png" alt="" />
            <div className={`${styles.cardText} text`}>
              <div className={`${styles.cardTitle}  ${darkMode ? styles.dark : '' }`}>Acessibilidade.</div>
              <div className={`${styles.cardBody} ${darkMode ? styles.cardBodydark : ''}`}>Nossa plataforma segue rigorosamente as normas de acessibilidade da W3C, garantindo uma experiência inclusiva para todos os usuários. Estamos comprometidos em proporcionar acessibilidade digital de qualidade.</div>
            </div>
          </div>
        </div>

        <div className={`${styles.cardrs} cardrs`}>
          <div className={`${styles.cardContents} contents`}>
            <img className={`${styles.cardImage} image`} src="images/2802.png" alt="" />
            <div className={`${styles.cardText} text`}>
            <div className={`${styles.cardTitle}  ${darkMode ? styles.dark : '' }`}>Segurança SSL</div>
            <div className={`${styles.cardBody} ${darkMode ? styles.cardBodydark : ''}`}>Nossa plataforma implementa certificados SSL para assegurar a proteção e criptografia das informações dos usuários, promovendo um ambiente seguro e confiável para todas as interações online.</div>
            </div>
          </div>
        </div>

        <div className={`${styles.cardrs} cardrs`}>
          <div className={`${styles.cardContents} contents`}>
          <img className={`${styles.cardImage} image`} src="images/2803.png" alt="" />
            <div className={`${styles.cardText} text`}>
            <div className={`${styles.cardTitle}  ${darkMode ? styles.dark : '' }`}>LGPD</div>
              <div className={`${styles.cardBody} ${darkMode ? styles.cardBodydark : ''}`}>Nossa plataforma segue os princípios de Governança de Proteção de Dados (GPD), garantindo a segurança e privacidade das informações dos nossos usuários.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlidCards;
