import React, { useContext, useState } from "react";
import { Route, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import SwitchButton from "../Buttons";
import { StyleContext } from "../../context/StyleContext";
import { SlMenu } from "react-icons/sl";

import styles from "./style.module.css";

const MenuTopAuth = () => {
  const navigate = useNavigate();
  const { increaseFontSize, decreaseFontSize } = useContext(StyleContext);
  const { darkMode } = useContext(StyleContext);

  const handleNavigation = (route) => {
    navigate(route);
  };

  return (
    <div
      className={` ${styles.menuatualParent} ${darkMode ? styles.dark : ""}`}
    >
      <div className={styles.menuatual}>
        <div className={styles.eRavWrapper}>
          <div className={`${styles.eRav} ${darkMode ? styles.dark : ""}`}>
            e-RAV
          </div>
        </div>
        <div className={styles.navigationtopdesktopbarsearc}>
          <div className={styles.navigationtopdesktopbarsearcInner}>
            <div className={styles.headlineParent}>
              <div className={styles.headline}>
                <div className={styles.buttonMenu}>Inicio</div>
              </div>
              <div className={styles.headline}>
                <div className={styles.buttonMenu}>Sobre</div>
              </div>
              <div className={styles.headline}>
                <div className={styles.buttonMenu}>Suporte</div>
              </div>
              <div className={styles.headline3} />
            </div>
          </div>
        </div>
        <div className={styles.instanceParentoff}>
          <div className={styles.instanceweb}>
            <div className={styles.aWrapper}>
              <b
                className={`${styles.eRav} ${darkMode ? styles.dark : ""} `}
                onClick={increaseFontSize}
              >
                A+
              </b>
            </div>
            <div className={styles.aContainer}>
              <b
                className={`${styles.eRav} ${darkMode ? styles.dark : ""} `}
                onClick={decreaseFontSize}
              >
                A-
              </b>
            </div>
            <SwitchButton />
          </div>
        </div>
      </div>
      <div className={styles.elementbuttonsmallfilledWrapper}>
        <div className={styles.elementbuttonsmallfilled}>
          <div className={styles.bg} />
          <Link to={"./SignIn"}>
            <b className={styles.buttonLabel}>Login</b>
          </Link>
        </div>
      </div>
    </div>
  );
};

const MenuTopApp = () => {
  const { logout } = useAuth();

  const navigate = useNavigate();

  const handleNavigation = (route) => {
    navigate(route);
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={styles.menuatualParent}>
      <div className={styles.menuatual}>
        <div className={styles.eRavWrapper}>
          <div className={styles.eRav}>e-RAV</div>
        </div>
        <div className={styles.navigationtopdesktopbarsearc}>
          <div className={styles.navigationtopdesktopbarsearcInner}>
            <div className={styles.headlineParent}>
              <div
                className={styles.headline}
                onClick={() => handleNavigation("/")}
              >
                <div className={styles.buttonMenu}>Inicio</div>
              </div>
              <div className={styles.headline}>
                <div className={styles.buttonMenu}>Sobre</div>
              </div>
              <div className={styles.headline}>
                <div className={styles.buttonMenu}>Suporte</div>
              </div>
              <div className={styles.headline3} />
            </div>
          </div>
        </div>
        <div className={styles.instanceParent}>
          <div className={styles.instancewebin}>
            <div className={styles.aWrapper}>
              <b className={styles.eRav}>A+</b>
            </div>
            <div className={styles.aContainer}>
              <b className={styles.eRav}>A-</b>
            </div>
            <SwitchButton />
          </div>
          <div className={styles.elementbuttonsmallfilledWrapperLoged}>
            <div className={styles.iconImage}>
              <h4 style={{ color: "#fff" }}></h4>
            </div>
            <div className={styles.iconMenuMobile} onClick={toggleDrawer}>
              <SlMenu />
            </div>
            <div className={`${styles.drawer} ${isOpen ? styles.open : ""}`}>
              <div className={styles.drawerIcon} onClick={toggleDrawer}>
                <SlMenu />
              </div>
              <div className={styles.drawerContent}>
                <div className={styles.contdrawer}>
                  <Link
                    to="/inicio"
                    className={styles.drawerLink}
                    onClick={toggleDrawer}
                  >
                    Início
                  </Link>
                  <Link
                    to="/sobre"
                    className={styles.drawerLink}
                    onClick={toggleDrawer}
                  >
                    Sobre
                  </Link>
                  <Link
                    to="/suporte"
                    className={styles.drawerLink}
                    onClick={toggleDrawer}
                  >
                    Suporte
                  </Link>
                  <div className={styles.btnModedark} />
                  <div className={styles.btnModedark}>Configuração</div>
                  <div className={styles.btnModedark}>
                    Modo Escuro <SwitchButton />
                  </div>
                  <div className={styles.btnModedark}>
                    <div>A+</div> <div>A-</div>
                  </div>
                </div>
                <div className={styles.buttonexitCont} onClick={handleLogout}>
                  <div className={styles.buttonexit}>Sair</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { MenuTopAuth, MenuTopApp };
