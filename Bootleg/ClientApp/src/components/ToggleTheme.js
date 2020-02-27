import React from 'react'
import { useTheme } from "../containers/ThemeContext";
import { ReactComponent as MoonIcon } from '../resources/images/icons/moon.svg';
import { ReactComponent as SunIcon } from '../resources/images/icons/sun.svg';
import { makeStyles } from "@material-ui/core/styles";
import { Tooltip } from "@material-ui/core";

// Trevor Moore
// CST-451
// 2/8/2020
// This is my own work.

// Creating our CSS styles:
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

// Toggle Theme component for switching between light and dark mode:
export default function ToggleTheme() {
    // Create our theme and styles:
    const themeState = useTheme();
    const classes = useStyles();
    // Return our toggle:
    return (
        <Tooltip title={themeState.isDark ? 'Light Mode' : 'Dark Mode'}>
            <button
                className={classes.toggleTheme}
                onClick={() => themeState.toggle()}>
                <SunIcon className={themeState.isDark ? `${classes.svg} ${classes.displayModeSvg}` : `${classes.svg} ${classes.hideModeSvg}`} />
                <MoonIcon className={themeState.isDark ? `${classes.svg} ${classes.hideModeSvg}` : `${classes.svg} ${classes.displayModeSvg}`} />
            </button>
        </Tooltip>
    );
};
