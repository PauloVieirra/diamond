import React, {useContext} from "react";
import styles from "./styles.module.css";
import { useAuth } from "../../context/AuthContext";

const Loading = () => {
    const { isLoading} =  useAuth();
    console.log(isLoading + ('teste'));
  return (
    <>
      {isLoading && (
        <div className={styles.overlay}>
          <div className={styles.loader}></div>
        </div>
      )}
    </>
  );
};

export default Loading;
