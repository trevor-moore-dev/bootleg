import React, { useState } from "react";
import NavigationBar from "../components/NavigationBar";
import ContentUpload from "../components/ContentUpload";
import Routes from "./Routes";
import { makeStyles } from "@material-ui/core/styles";
import useAuth from "../hooks/useAuth";
import Login from "../pages/Login";
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import {
	Fab,
	Typography,
	IconButton,
	Snackbar,
	SnackbarContent,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	FormControl,
	FormControlLabel,
	InputLabel,
	MenuItem,
	Select,
	Switch
} from '@material-ui/core';

// Trevor Moore
// CST-451
// 12/9/2019
// This is my own work.

// Create CSS styles:
const useStyles = makeStyles(theme => ({
	toolbar: theme.mixins.toolbar,
	root: {
		padding: theme.spacing(2)
	}
}));

// Template component for rendering the template of our web app, and where main components get rendered within it:
export default function Template() {
	// Create our styles and declare our state properties with the useState Hooks API:
	const classes = useStyles();
	const { authState, getToken } = useAuth();

	// Get the authorization token from the cookies if its there:
	getToken();

	// Render our markup:
	return (
		<>
			{authState.isAuthenticated ? (
				<>
					<NavigationBar />
					<div className={classes.toolbar} />
					<main className={classes.content}>
						<div className={classes.root}>
							<Routes />
						</div>
					</main>
					<ContentUpload />
				</>
			) : (
					<>
						<NavigationBar />
						<div className={classes.toolbar} />
						<main className={classes.content}>
							<div className={classes.root}>
								<Login />
							</div>
						</main>
					</>
				)}
		</>
	);
}