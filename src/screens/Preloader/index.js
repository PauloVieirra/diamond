import React,{useContext} from "react";
import { Link } from "react-router-dom";
import styles from './style.module.css';
import SlidCards from "../../componets/Sliding";
import { StyleContext } from "../../context/StyleContext";
import { FooterMobi, FooterWeb } from "../../componets/Footer";

export const Preloader = () => {
	const { darkMode, toggleDarkMode } = useContext(StyleContext);
	const { fontSize } = useContext(StyleContext);

  	return (
		<main className={`app ${darkMode ? 'dark-mode' : 'light-mode'}`}>
    		<div className={styles.preloader}>
				<div className={styles.heromobi}>
				<img className={styles.heroimg} src="images/heroimagemobi.png"/>
				<div className={styles.herodegrade}></div>
				<div className={styles.contbtnlogin}>
						<Link to="/signin" className={styles.btnlogin}>Login</Link>
						<Link to="/signup" className={styles.btnsignup}><div>Não tem uma conta? cadastre-se</div></Link> 
				</div>
				</div>
      			<div className={styles.heroContentParent}>
        				<div className={styles.heroContent}>
							<div className={` ${styles.title} ${darkMode ? styles.dark : ''}`}>Relatório escolar.</div>
          					<div className={styles.textBlockherotitleBodyAct}>
            						<h4 className={` ${styles.text} ${darkMode ? '' : 'dark-mode'}`}>
										<p style={{ fontSize: `${fontSize}px` }}>
											 Descubra o RAV, a plataforma que redefine a eficiência operacional e 
										a segurança para seu negócio. Integrando todas as funções essenciais 
										em uma única solução robusta, o RAV simplifica a tomada de decisões e
										 impulsiona a produtividade. Com recursos avançados de segurança cibernética,
										  garantimos a proteção de seus dados mais sensíveis, oferecendo tranquilidade 
										  absoluta em seu uso diário.
										  </p>
									</h4>
            						
          					</div>
							  <div className={styles.ctaParent}>
              					<div className={styles.btnprymary}>
                  					<div className={styles.button}>Assinar</div>
              					</div>
								<div className={styles.btnsecondary}>
									<div className={styles.button}>Assinar</div>
							    </div>	
            				 </div>
        				</div>
        				<div className={styles.vectorParent}>
          					<img className={styles.frameChild} alt="" src="images/ellipse-228.svg"/>
          					<img className={styles.image5Icon} alt="" src="images/image-5.svg"/>
          					<img className={styles.frameItem} alt="" src="images/ellipse-233.png"/>
          					<img className={styles.frameInner} alt="" src="images/ellipse-231.svg"/>
          					<img className={styles.ellipseIcon} alt="" src="images/ellipse-232.svg"/>
          					<img className={styles.frameChild1} alt="" src="images/ellipse-234.png"/>
          					<img className={styles.frameChild2} alt="" src="images/ellipse-229.svg"/>
          					<img className={styles.frameChild3} alt="" src="images/ellipse-230.svg"/>
        				</div>
      			</div>
      			<div className={styles.undrawMobileLoginIkmvEleParent}>
        				<div className={styles.undrawMobileLoginIkmvEle}>
          					<img className={styles.image6Icon} alt="" src="images/image-6.svg"/>
          					<div className={styles.iconIoniconsOutlineAiParent}>
            						<img className={styles.iconIoniconsOutlineAi} alt="" src="images/airplane.svg" />
            						<img className={styles.iconIoniconsOutlineAm} alt="" src="images/ball.png" />
            						<img className={styles.iconIoniconsOutlineBa} alt="" src="images/direction.png" />
            						<img className={styles.iconIoniconsOutlineBa1} alt="" src="images/football-outline.png" />
            						<img className={styles.iconIoniconsOutlineBi} alt="" src="images/bike.png" />
            						<img className={styles.iconIoniconsOutlineBr} alt="" src="images/science.png" />
            						<img className={styles.iconIoniconsOutlineCa} alt="" src="images/cam.png" />
            						<img className={styles.iconIoniconsOutlineCa1} alt="" src="images/cash-outline.png" />
            						<img className={styles.iconIoniconsOutlineCo} alt="" src="images/pencil.png" />
            						<img className={styles.iconIoniconsOutlineFa} alt="" src="images/food.png" />
            						<img className={styles.iconIoniconsOutlineFl} alt="" src="images/rain.png" />
            						<img className={styles.iconIoniconsOutlineFl1} alt="" src="images/telescopy.png" />
            						<img className={styles.iconIoniconsOutlineNu} alt="" src="images/gyn.png" />
            						<img className={styles.iconIoniconsOutlinePe} alt="" src="images/pen.png" />
            						<img className={styles.iconIoniconsOutlineRi} alt="" src="images/tint.png" />
            						<img className={styles.iconIoniconsOutlineRo} alt="" src="images/rocket.png" />
            						<img className={styles.iconIoniconsOutlineSc} alt="" src="images/study.png" />
            						<img className={styles.iconIoniconsOutlineSe} alt="" src="images/search.png" />
            						<img className={styles.iconIoniconsOutlineTe} alt="" src="images/telescopy.png" />
            						<img className={styles.iconIoniconsOutlineTe1} alt="" src="images/baseball.png" />
            						<img className={styles.iconIoniconsOutlineTr} alt="" src="images/direction.png" />
            						<img className={styles.iconIoniconsOutlineTr1} alt="" src="images/trophy.png" />
          					</div>
        				</div>
        				<div className={styles.section}>
          					<div className={styles.content}>
							  <div className={` ${styles.title} ${darkMode ? styles.dark : ''}`}>Rápido, leve, poderoso.</div>
            						<div className={styles.sectionText}>
              							<h4 className={styles.text}>Automatizando processos complexos que anteriormente consumiam horas de trabalho manual, o RAV não apenas simplifica, mas também impulsiona a inovação em todos os setores. Com uma segurança robusta, ele garante conformidade com as mais rigorosas regulamentações, protegendo suas operações e dados.</h4>
            						</div>
          					</div>
        				</div>
      			</div>
      			<div className={`${styles.section3} ${darkMode ? styles.section3dark : '' }`}>
        				<div className={styles.smartmockupsLy4t1kiu1Parent}>
          					<div className={` ${styles.conectionParent} ${darkMode ? styles.conectionParentdark : '' }`}>
            						
									<div className={styles.conection}>
										<div className={` ${styles.title} ${darkMode ? styles.dark : ''}`}>Conexão e controle.</div>
              							<div className={styles.sectionText1}>
                								<h4 className={` ${styles.text} ${darkMode ? '' : 'dark-mode'}`}>
													Com acesso instantâneo o e-Rav é um aplicativo intuitivo permite que você gerencie seu negócio de qualquer lugar, a qualquer momento, proporcionando uma flexibilidade sem precedentes. Nossa interface amigável reduz o tempo de treinamento, aumentando rapidamente a eficiência dos usuários.
												
												</h4>
              							
										<div className={styles.smallButton}>
              							<b className={styles.buttonSample}>{`Saber Mais `}</b>
            					    	</div>
										</div>
            						</div>

									
            						
          					</div>
							<img className={styles.smartmockups} alt="" src="smartmockup.png" />
        				</div>
      			</div>
      			<div className={styles.preloaderInner}>
        				
          					<div className={styles.frameContainer}>
            						<div className={styles.content}>
              							<div className={styles.conection}>
                								<div className={` ${styles.title} ${darkMode ? styles.dark : ''}`}>Mobilidade e eficiência.</div>
                								<h4 className={styles.paragraph}>Com acesso instantâneo o e-Rav é um aplicativo intuitivo permite que você gerencie seu negócio de qualquer lugar, a qualquer momento, proporcionando uma flexibilidade sem precedentes. Nossa interface amigável reduz o tempo de treinamento, aumentando rapidamente a eficiência dos usuários.</h4>
              							</div>
              							<div className={styles.textBlocksectionlargetitle1}>
                								<div className={styles.elementcardinfoCardmedium}>
                  									<img className={styles.elementcardinfoCardsmalliIcon} alt="" src="Element/Card/Info-Card/Small/Icon-Position/Left.png" />
                  									<div className={`${styles.title2} ${darkMode ? styles.dark : ''}`}>Professores</div>
                  									<div className={`${styles.body2} ${darkMode ? styles.dark : ''}`}>{`Como professor, você tera acesso a uma plataforma que vai agilizar seu trabalho, garantindo confiabilidade e automação no processo. `}</div>
                								</div>
                								<div className={styles.elementcardinfoCardmedium}>
                  									<img className={styles.elementcardinfoCardsmalliIcon} alt="" src="Element/Card/Info-Card/Small/Icon-Position/Left.png" />
                  									<div className={`${styles.title2} ${darkMode ? styles.dark : ''}`}>Gestores</div>
                  									<div className={`${styles.body2} ${darkMode ? styles.dark : ''}`}>{`Em um mundo cada vez mais tecnologico é importante que nossas organizações esteja atualizada com as melhores tendências e praticas. `}</div>
                								</div>
              							</div>
            						</div>
        				</div>
      			</div>
      			<div className={styles.undrawMobileLoginIkmvEleWrapper}>
        				<div className={styles.undrawMobileLoginIkmvEle1}>
          					<div className={styles.pricingWrapper}>
            						<div className={styles.pricing}>
              							<img className={styles.rectangleIcon} alt="" src="images/Rectangle.svg" />
              							<div className={styles.textBlocksectionlargetitle2}>
                								<div className={styles.titleParent}>
												<div className={` ${styles.title} ${darkMode ? styles.dark : ''}`}>Acesso imediato.</div>
												<h4 className={` ${styles.textz} ${darkMode ? '' : 'dark-mode'}`}>Obtenha acesso imediato ao poder transformador do RAV. Com nosso aplicativo móvel intuitivo, você pode gerenciar seu negócio de qualquer lugar, a qualquer momento, bastando uma conexão com a internet.</h4>
                  									<div className={`${styles.price} ${darkMode ? styles.dark : ''}`}>R$40</div>
                  									<div className={styles.title5}>Plano mensal</div>
                  									<div className={styles.elementbuttonmediumfilled}>
                    										<div className={styles.bg1} />
                    										<Link to={'/PaymentPage'}> <div className={styles.buttonLabel1}>Planos</div> </Link>
                  									</div>
                  									<div className={`${styles.body5} ${darkMode ? styles.dark : ''}`}>Veja outros preços.</div>
                  									<img className={styles.frameChild4} alt="" src="images/circle2.svg" />
                  									<img className={styles.frameChild5} alt="" src="images/circle1.svg" />
                  									<img className={styles.frameChild6} alt="" src="images/circle5.svg" />
                  									<img className={styles.frameChild7} alt="" src="images/circle4.svg" />
                  									<img className={styles.polygonIcon} alt="" src="images/circle3.svg" />
                  									<img className={styles.frameChild8} alt="" src="images/circle2.svg" />
                								</div>
              							</div>
            						</div>
          					</div>
        				</div>
      			</div>
			    <div className={styles.slidercontainer}>
                <SlidCards/>
				</div>
      			<div className={styles.frameParent}>
        				<div className={styles.image3Parent}>
          					<img className={styles.image3Icon} alt="" src="images/acessibility.svg" />
          					<div className={styles.textBlocksectionlargetitle3}>
            						<div className={styles.title6}>Acessibilidade.</div>
            						<div className={styles.body6}>Nossa plataforma segue rigorosamente as normas de acessibilidade da W3C, garantindo uma experiência inclusiva para todos os usuários. Estamos comprometidos em proporcionar acessibilidade digital de qualidade.</div>
          					</div>
        				</div>
        				<div className={styles.image3Parent}>
          					<img className={styles.image3Icon} alt="" src="images/security.svg" />
          					<div className={styles.textBlocksectionlargetitle3}>
            						<div className={styles.title6}>Segurança SSL</div>
            						<div className={styles.body6}>Nossa plataforma implementa certificados SSL para assegurar a proteção e criptografia das informações dos usuários, promovendo um ambiente seguro e confiável para todas as interações online.</div>
          					</div>
        				</div>
        				<div className={styles.undrawMobileLoginIkmvEle2}>
          					<div className={styles.undrawMobileLoginIkmvEleInner}>
            						<div className={styles.image4Wrapper}>
              							<img className={styles.image4Icon} alt="" src="images/lgpd.svg" />
            						</div>
          					</div>
          					<div className={styles.textBlocksectionlargetitle5}>
            						<div className={styles.title6}>LGPD</div>
            						<div className={styles.body8}>Nossa plataforma segue os princípios de Governança de Proteção de Dados (GPD), garantindo a segurança e privacidade das informações dos nossos usuários.</div>
          					</div>
        				</div>
      			</div>
				<div className={styles.footmobile}>
				<FooterMobi/>	
				</div>
    		</div>
			</main>
		);
};


