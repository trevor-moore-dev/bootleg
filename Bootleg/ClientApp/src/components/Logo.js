import React from "react";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import BootlegLogo from "../resources/images/BootlegLogo.PNG";

// Trevor Moore
// CST-451
// 12/9/2019
// Coded in collaboration with Jordan Riley at OpportunityHack 2019. Class is "boiler plate" / standard / reusable code.

/**
 * Use this later for breakpoint CSS:
 * [theme.breakpoints.down("sm")]: {
 *		display: "none"
 * }
 **/

// Create CSS styles:
const useStyles = makeStyles(theme => ({
  root: {
    textDecoration: "none",
    color: "white",
    marginRight: theme.spacing(2)
  },
  logo: {
    height: 35,
    float: "center",
    verticalAlign: "middle"
  }
}));

// Logo component for rendering our logo:
export default function Logo({ className }) {
  // Make our styles:
  const classes = useStyles();
  // Render markup:
  return (
    <div className={className}>
      <Typography variant="h6" component={Link} to="/" className={classes.root}>
        <img src={BootlegLogo} alt="bootleg" className={classes.logo} />
      </Typography>
    </div>
  );
}