import React, { createContext, useContext, useState } from 'react';

// En tu ThemeContext.js
const ThemeContext = React.createContext();
const ThemeUpdateContext = React.createContext();

export function useTheme() {
    return useContext(ThemeContext);
}

export function useThemeUpdate() {
    return useContext(ThemeUpdateContext);
}

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('light');

    function toggleTheme() {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    }

    return (
        <ThemeContext.Provider value={theme}>
            <ThemeUpdateContext.Provider value={toggleTheme}>
                {children}
            </ThemeUpdateContext.Provider>
        </ThemeContext.Provider>
    );
};

