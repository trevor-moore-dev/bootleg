import React from "react";
import { Typography, Box } from "@material-ui/core";

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
