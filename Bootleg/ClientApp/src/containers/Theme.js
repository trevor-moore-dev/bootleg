import React from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
		  light: "rgb(60,60,60)",
		  main: "rgb(55,55,55)"
    }
  },
  typography: {
    useNextVariants: true
  }
});

export default function CustomTheme(props) {
  return <MuiThemeProvider theme={theme}>{props.children}</MuiThemeProvider>;
}