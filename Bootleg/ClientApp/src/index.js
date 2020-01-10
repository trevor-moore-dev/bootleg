import * as serviceWorker from "./serviceWorker";
import ReactDOM from "react-dom";
import React from "react";
import App from "./App";
import { ThemeProvider } from "./containers/ThemeContext";

// Trevor Moore
// CST-451
// 12/9/2019
// This is my own work.

// Render our App component (which is our SPA) at the root element:
ReactDOM.render(
    <ThemeProvider><App /></ThemeProvider>,
    document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();