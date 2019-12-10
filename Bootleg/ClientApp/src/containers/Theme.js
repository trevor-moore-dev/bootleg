import React from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

// Trevor Moore
// CST-451
// 12/9/2019
// Coded in collaboration with Jordan Riley at OpportunityHack 2019. Class is "boiler plate" / standard / reusable code.

// Create CSS site-wide themes:
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

// Function for returning the CSS themes:
export default function CustomTheme(props) {
  return <MuiThemeProvider theme={theme}>{props.children}</MuiThemeProvider>;
}