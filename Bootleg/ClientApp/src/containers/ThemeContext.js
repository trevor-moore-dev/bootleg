import React from "react";

const defaultContextData = {
    isDark: false,
    toggle: () => { }
};
const ThemeContext = React.createContext(defaultContextData);
export const useTheme = () => React.useContext(ThemeContext);
const useEffectDarkMode = () => {
    const [themeState, setThemeState] = React.useState({
        dark: false,
        hasThemeMounted: false
    });
    React.useEffect(() => {
        const isDark = localStorage.getItem("dark") === "true";
        setThemeState({ ...themeState, isDark: isDark, hasThemeMounted: true });
    }, []);
    return [themeState, setThemeState];
};

export const ThemeProvider = ({ children }) => {
    const [themeState, setThemeState] = useEffectDarkMode();
    if (!themeState.hasThemeMounted) {
        return <div />;
    }
    const toggle = () => {
        const isDark = !themeState.isDark;
        localStorage.setItem("dark", JSON.stringify(isDark));
        setThemeState({ ...themeState, isDark });
    };
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