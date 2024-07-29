import React from "react";
import styles from './styles.module.css';


const FooterWeb = () => {
    return (
        <div className={styles.footerweb}>
        <div className={styles.newsletterWrapper}>
              <div className={styles.newsletter}>
                    <div className={styles.menu}>
                          <div className={styles.novidades}>Novidades</div>
                          <div className={styles.seInscrevaPara}>Se inscreva para receber novidades sobre nossos produtos e atualizações</div>
                    </div>
                    <div className={styles.colornewsletter}>
                          <img className={styles.coloricon} alt="" src="Color/Icon.svg" />
                          <div className={styles.eRav}>Informe seu e-mail</div>
                          <div className={styles.right}>
                                <div className={styles.colorbutton}>
                                      <div className={styles.registerLogin}>Enviar</div>
                                </div>
                          </div>
                    </div>
              </div>
        </div>
        <div className={styles.left}>
              <div className={styles.introduction}>
                    <div className={styles.logo}>e-RAV</div>
                    <div className={styles.estamosDisponveis24h}>Estamos disponíveis 24h, 7 dias por semana para melhor atender nossos cliente, em caso de dúvidas  entre em contato por um de nossos canais.</div>
              </div>
              <div className={styles.contact}>
                    <div className={styles.lighttel}>
                          <img className={styles.icons} alt="" src="Icons.svg" />
                          <div className={styles.text}>
                                <b className={styles.logo}>Telefone</b>
                                <div className={styles.div}>61-437-2766</div>
                          </div>
                    </div>
                    <div className={styles.lighttel}>
                          <img className={styles.icons} alt="" src="Icons.svg" />
                          <div className={styles.text}>
                                <b className={styles.logo}>Mail</b>
                                <div className={styles.div}>emaik@email.com</div>
                          </div>
                    </div>
                    <div className={styles.lighttel}>
                          <img className={styles.icons} alt="" src="Icons.svg" />
                          <div className={styles.text}>
                                <b className={styles.logo}>Endereço</b>
                                <div className={styles.bsb44444444}>55 BSB 44444444</div>
                          </div>
                    </div>
                    <div className={styles.lighttel}>
                          <img className={styles.lighticon} alt="" src="Light/Icon.svg" />
                          <div className={styles.text3}>
                                <b className={styles.logo}>Whatsapp</b>
                                <div className={styles.div}>+55- 61 -000-0000</div>
                          </div>
                    </div>
              </div>
        </div>
  </div>
    );
}

const FooterMobi = () => {
    return (
        <div className={styles.footer}>
        <div className={styles.footerContent}>
            <p>&copy; 2024 Diamond . Todos os direitos reservados.</p>
            <p>Contato: contato@contato.com</p>
            <div className={styles.footerLinks}>
                <a href="/">Termos de Serviço</a>
                <a href="/">Política de Privacidade</a>
            </div>
        </div>
    </div>
    );
}

export {FooterMobi, FooterWeb};


