import React from "react";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import BootlegLogo from "../resources/images/BootlegLogo.PNG";

const useStyles = makeStyles(theme => ({
  root: {
    textDecoration: "none",
    color: "white",
	  marginRight: theme.spacing(2),
	  [theme.breakpoints.down("sm")]: {
		display: "none"
	  }
  },
  logo: {
	height: 35,
	float: "center",
	verticalAlign: "middle"
  }
}));

export default function Logo({ className }) {
	const classes = useStyles();
  return (
    <div className={className}>
	  <Typography variant="h6" component={Link} to="/" className={classes.root}>
		<img src={BootlegLogo} alt="bootleg" className={classes.logo} />
      </Typography>
    </div>
  );
}