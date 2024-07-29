import React, { createContext, useState, useEffect } from 'react';
export const StyleContext = createContext();


export const StyleProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(false);
    const [fontSize, setFontSize] = useState(16); 

    // Carregar preferência do usuário ao montar o componente
    useEffect(() => {
        const savedMode = localStorage.getItem('darkMode');
        if (savedMode === 'true') {
            setDarkMode(true);
        }
        
        const savedFontSize = localStorage.getItem('fontSize');
        if (savedFontSize) {
            setFontSize(parseInt(savedFontSize, 10)); // Define o tamanho da fonte salvo
        }
    }, []);

    // Alterna entre modo claro e escuro
    const toggleDarkMode = () => {
        setDarkMode(prevMode => !prevMode);
    };

    // Altera o tamanho da fonte
    const increaseFontSize = () => {
        setFontSize(prev => Math.min(prev + 1, 22)); // Aumenta até 20px
    };

    const decreaseFontSize = () => {
        setFontSize(prev => Math.max(prev - 1, 15)); // Diminui até 15px
    };

    // Salvar as escolhas do usuário
    useEffect(() => {
        localStorage.setItem('darkMode', darkMode.toString());
        localStorage.setItem('fontSize', fontSize); 
    }, [darkMode, fontSize]);

    return (
        <StyleContext.Provider
            value={{
                darkMode,
                toggleDarkMode,
                fontSize,
                increaseFontSize,
                decreaseFontSize,
            }}
        >
            {children}
        </StyleContext.Provider>
    );
};
