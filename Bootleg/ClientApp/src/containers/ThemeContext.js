import React from "react";

// Trevor Moore
// CST-451
// 2/8/2020
// I used source code from: https://medium.com/maxime-heckel/switching-off-the-lights-adding-dark-mode-to-your-react-app-with-context-and-hooks-f41da6e07269

// Set a default context object:
const defaultContextData = {
    isDark: false,
    toggle: () => { }
};

// Create a theme context based off the default state:
const ThemeContext = React.createContext(defaultContextData);

// Export a "useTheme" method for returning the theme context of the app:
export const useTheme = () => React.useContext(ThemeContext);

// Create a custom hook for returning the current theme state of the app.
const useEffectDarkMode = () => {
    // Set default state:
    const [themeState, setThemeState] = React.useState({
        dark: false,
        hasThemeMounted: false
    });
    // useEffect hook for determing dark/light mode, and set the state:
    React.useEffect(() => {
        const isDark = localStorage.getItem("dark") === "true";
        setThemeState({ ...themeState, isDark: isDark, hasThemeMounted: true });
    }, []);
    // Return the state in array notation:
    return [themeState, setThemeState];
};

// Export method for returning the Theme Provider:
export const ThemeProvider = ({ children }) => {
    // Grab the current theme state:
    const [themeState, setThemeState] = useEffectDarkMode();
    // If it has mounted already do nothing:
    if (!themeState.hasThemeMounted) {
        return <div />;
    }
    // Set const method for toggling the theme state:
    const toggle = () => {
        const isDark = !themeState.isDark;
        localStorage.setItem("dark", JSON.stringify(isDark));
        setThemeState({ ...themeState, isDark });
    };
    // Return the Theme Provider:
    return (
        <ThemeContext.Provider
            value={{
                isDark: themeState.isDark,
                toggle
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};