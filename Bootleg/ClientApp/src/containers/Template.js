import React from "react";
import NavigationBar from "../components/NavigationBar";
import Routes from "./Routes";
import { makeStyles } from "@material-ui/core/styles";
import useAuth from "../hooks/useAuth";
import Login from "../pages/Login";
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';

// Trevor Moore
// CST-451
// 12/9/2019
// This is my own work.

// Create CSS styles:
const useStyles = makeStyles(theme => ({
	toolbar: theme.mixins.toolbar,
	fab: {
		margin: theme.spacing(1),
		position: "fixed",
		bottom: theme.spacing(2),
		right: theme.spacing(3),
		color: theme.button.text,
		backgroundColor: theme.button.background,
		"&:hover": {
			backgroundColor: theme.button.hover
		}
	},
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
					{/** Snackbar or Dialog here for post input */}
					<Fab className={classes.fab}>
						<EditIcon />
					</Fab>
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