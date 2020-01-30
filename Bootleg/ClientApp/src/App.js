import React from "react";
import { lightTheme, darkTheme } from "./containers/Theme";
import { CssBaseline } from "@material-ui/core";
import Template from "./containers/Template";
import store from "./store";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { useTheme } from "./containers/ThemeContext";
import { MuiThemeProvider } from "@material-ui/core/styles";
import './resources/css/site.css';

// Trevor Moore
// CST-451
// 12/9/2019
// This is my own work.

// Our overarching App function (essentially it's a component, but it's not technically speaking) for our SPA:
export default function App() {
  const themeState = useTheme();
  // Render our markup with our Provider (with the store), Theme, Css, Router, and Template:
  return (
    <Provider store={store}>
      <MuiThemeProvider theme={themeState.isDark ? darkTheme : lightTheme}>
        <CssBaseline />
        <Router>
          <Template />
        </Router>
      </MuiThemeProvider>
    </Provider>
  );
}