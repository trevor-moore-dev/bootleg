import React from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
		light: "rgb(60,60,60)",
		main: "rgb(147,112,219)"
	},
	secondary: {
		light: "rgb(255,255,255)",
		main: "rgb(255,255,255)"
	}
  },
  typography: {
    useNextVariants: true
  }
});

export default function CustomTheme(props) {
  return <MuiThemeProvider theme={theme}>{props.children}</MuiThemeProvider>;
}