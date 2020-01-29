import { createMuiTheme } from "@material-ui/core/styles";

// Trevor Moore
// CST-451
// 12/9/2019
// This is my own work.

// Create dark & light mode CSS site-wide themes:
export const lightTheme = createMuiTheme({
  background: "#F8F8F9",
  gradient: "linear-gradient(#091236, #1E215D)",
  text: "rgb(60,60,60)",
  general: {
    dark: "rgb(255,255,255)",
    medium: "rgb(147,112,219)",
    light: "#363537"
  },
  button: {
    text: "rgb(255,255,255)",
    background: "rgb(147,112,219)",
    hover: "rgb(113,80,181)"
  },
  divider: {
    backgroundColor: "#D3D3D3"
  },
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
    },
    MuiInputLabel: {
      root: {
        color: "rgb(60,60,60)"
      }
    },
    MuiButton: {
      contained: {
        marginTop: "16px",
        color: "rgb(255,255,255)",
        backgroundColor: "rgb(147,112,219)",
        "&:hover": {
          backgroundColor: "rgb(113,80,181)"
        }
      }
    },
    MuiTypography: {
      root: {
        color: "rgb(60,60,60)"
      }
    },
    MuiCard: {
      root: {
        backgroundColor: "rgb(255,255,255)"
      }
    },
    MuiToolbar: {
      root: {
        justifyContent: "center"
      }
    },
    MuiSnackbarContent: {
      message: {
        width: "100%"
      }
    },
    MuiCardHeader: {
      subheader: {
        color: "#A9A9A9"
      }
    }
  }
});

export const darkTheme = createMuiTheme({
  background: "#363537",
  gradient: "linear-gradient(#DE4DAA, #F6D327)",
  text: "rgb(255,255,255)",
  general: {
    dark: "#363537",
    medium: "rgb(147,112,219)",
    light: "rgb(255,255,255)"
  },
  button: {
    text: "rgb(255,255,255)",
    background: "rgb(147,112,219)",
    hover: "rgb(113,80,181)"
  },
  divider: {
    backgroundColor: "#696969"
  },
  palette: {
    primary: {
      light: "#363537",
      main: "#363537"
    },
    secondary: {
      light: "#363537",
      main: "#363537"
    },
    background: {
      default: "#2b2b2b"
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
        backgroundColor: "rgb(255,255,255)"
      }
    },
    MuiTextField: {
      root: {
        color: "rgb(191,191,191)"
      }
    },
    MuiInputLabel: {
      outlined: {
        color: "rgb(191,191,191)",
        "&$focused": {
          color: "rgb(147,112,219)"
        }
      },
      filled: {
        color: "rgb(191,191,191)",
        "&$focused": {
          color: "rgb(147,112,219)"
        }
      },
    },
    MuiFormLabel: {
      root: {
        "&$focused": {
          color: "rgb(147,112,219)"
        }
      }
    },
    MuiOutlinedInput: {
      root: {
        color: "rgb(191,191,191)",
        "&$focused": {
          color: "rgb(191,191,191)",
        }
      },
      notchedOutline: {
        borderColor: "rgb(147,112,219)",
        color: "rgb(191,191,191)",
      },
    },
    MuiFilledInput: {
      root: {
        color: "rgb(191,191,191)",
        "&$focused": {
          color: "rgb(191,191,191)"
        }
      }
    },
    MuiButton: {
      contained: {
        marginTop: "16px",
        color: "rgb(255,255,255)",
        backgroundColor: "rgb(147,112,219)",
        "&:hover": {
          backgroundColor: "rgb(113,80,181)"
        }
      }
    },
    MuiTypography: {
      root: {
        color: "rgb(255,255,255)"
      }
    },
    MuiCard: {
      root: {
        backgroundColor: "#363537"
      }
    },
    MuiPaper: {
      root: {
        backgroundColor: "#363537"
      }
    },
    MuiToolbar: {
      root: {
        justifyContent: "center"
      }
    },
    MuiIconButton: {
      colorPrimary: {
        color: "rgb(147,112,219)"
      }
    },
    MuiSnackbarContent: {
      message: {
        width: "100%"
      }
    },
    MuiCardHeader: {
      subheader: {
        color: "#A9A9A9"
      }
    }
  }
});