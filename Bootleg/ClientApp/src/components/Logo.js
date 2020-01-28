import React from "react";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import BootlegLogo from "../resources/images/BootlegLogo.PNG";
import LazyLoad from 'react-lazyload';

// Trevor Moore
// CST-451
// 12/9/2019
// This is my own work.

// Create CSS styles:
const useStyles = makeStyles(theme => ({
  root: {
    textDecoration: "none",
    color: "white"
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
        <LazyLoad>
          <img src={BootlegLogo} alt="bootleg" className={classes.logo} />
        </LazyLoad>
      </Typography>
    </div>
  );
}