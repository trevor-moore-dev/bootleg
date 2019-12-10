import React from "react";
import { Typography, Box } from "@material-ui/core";

// Trevor Moore
// CST-451
// 12/9/2019
// This is my own work.

// Home component for rendering the home page:
export default function Home() {
  const brand = 'Hello! This is bootleg.';
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Typography variant="h4" gutterBottom>
        {brand}
      </Typography>
    </Box>
  );
}
