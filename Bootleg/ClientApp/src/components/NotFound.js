import React from "react";
import {
  Box
} from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";

// Trevor Moore
// CST-451
// 12/9/2019
// This is my own work.

// Create our CSS styles:
const useStyles = makeStyles(theme => ({
  text: {
    color: theme.text
  }
}));

// Function for returning our Not Found 404 page:
export default function NotFound() {
  const classes = useStyles();
  return (
    <Box
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'>
      <div className={classes.text}>404 Page Not found :(</div>
    </Box>
  );
}