import React, { Component } from "react";
import Theme from "./containers/Theme";
import { CssBaseline } from "@material-ui/core";
import Template from "./containers/Template";
import store from "./store";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";

// Trevor Moore
// CST-451
// 12/9/2019
// This is my own work.

// Our overarching App component for our SPA:
class App extends Component {
  static displayName = "bootleg";
  // Render our markup with our Provider (with the store), Theme, Css, Router, and Template:
  render() {
    return (
      <Provider store={store}>
        <Theme>
          <CssBaseline />
          <Router>
            <Template />
          </Router>
        </Theme>
      </Provider>
    );
  }
}

export default App;