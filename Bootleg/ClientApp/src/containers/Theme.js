import { createMuiTheme } from "@material-ui/core/styles";

// Trevor Moore
// CST-451
// 12/9/2019
// Coded in collaboration with Jordan Riley at OpportunityHack 2019. Class is "boiler plate" / standard / reusable code.

// Create CSS site-wide themes:
export const lightTheme = createMuiTheme({
  background: "#F8F8F9",
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
  },
  overrides: {
    MuiSwitch: {
      thumb: {
        color: "#363537"
      }
    }
  }
});

export const darkTheme = createMuiTheme({
  background: "#363537",
  palette: {
    primary: {
      light: "#363537",
      main: "#363537"
    },
    secondary: {
      light: "#363537",
      main: "#363537"
    }
  },
  typography: {
    useNextVariants: true
  },
  overrides: {
    MuiSwitch: {
      thumb: {
        color: "rgb(147,112,219)"
      },
      track: {
        backgroundColor: "rgb(255,255,255)",
      }
    }
  }
});