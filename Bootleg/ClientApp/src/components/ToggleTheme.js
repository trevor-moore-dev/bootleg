import React from 'react'
import { useTheme } from "../containers/ThemeContext";
import { ReactComponent as MoonIcon } from '../resources/images/icons/moon.svg';
import { ReactComponent as SunIcon } from '../resources/images/icons/sun.svg';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    toggleTheme: {
        position: "relative",
        display: "flex",
        background: theme.gradient,
        margin: "0 auto",
        borderRadius: "30px",
        border: "2px solid rgb(147,112,219)",
        fontSize: "0.5rem",
        overflow: "hidden",
        cursor: "pointer",
        outline: "none"
    },
    svg: {
        width: "1rem",
        height: "auto",
        transition: "all 0.5s linear"
    },
    hideModeSvg: {
        transform: 'translateY(50px)'
    },
    displayModeSvg: {
        transform: 'translateY(0)'
    }
}));

export default function ToggleTheme() {
    const themeState = useTheme();
    const classes = useStyles();
    return (
        <button
            className={classes.toggleTheme}
            onClick={() => themeState.toggle()}
        >
            <SunIcon className={themeState.isDark ? `${classes.svg} ${classes.displayModeSvg}` : `${classes.svg} ${classes.hideModeSvg}`} />
            <MoonIcon className={themeState.isDark ? `${classes.svg} ${classes.hideModeSvg}` : `${classes.svg} ${classes.displayModeSvg}`} />
        </button>
    );
};
