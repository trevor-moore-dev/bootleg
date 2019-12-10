import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import clsx from "clsx";
import Logo from "./Logo";
import useAuth from "../hooks/useAuth";
import Cookies from "js-cookie";
import { Avatar, Box, Menu, MenuItem, Grid, IconButton, Button, Toolbar, AppBar } from "@material-ui/core";
import DropDownArrow from "@material-ui/icons/ArrowDropDown";
import '../resources/css/site.css';

// Trevor Moore
// CST-451
// 12/9/2019
// Coded in collaboration with Jordan Riley at OpportunityHack 2019. Class is "boiler plate" / standard / reusable code.

// Define the width for the drawer:
const drawerWidth = 240;

// Create CSS styles:
const useStyles = makeStyles(theme => ({
	appBarShift: {
		backgroundColor: 'white',
		width: `calc(100% - ${drawerWidth}px)`,
		marginLeft: drawerWidth,
		transition: theme.transitions.create(["margin", "width"], {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen
		})
	}
}));

// Nav Bar component for the top of the web app:
export default function NavigationBar({ handleDrawerOpen, open }) {
	// Create our styles and declare our state properties:
	const classes = useStyles();
	const { logout, authState } = useAuth();
	const [avatarUrl, setAvatarUrl] = useState("");
	const [anchorEl, setAnchorEl] = React.useState(null);

	// Use the useEffect() Hook API to run after Render has committed to the screen:
	useEffect(() => {
		let avatar = Cookies.get("Avatar-Url");
		if (avatar) setAvatarUrl(avatar);
		else setAvatarUrl("");
	}, [authState]);

	// Method for handling when the menu closes:
	const handleClose = () => {
		setAnchorEl(null);
	};

	// Method for handling when the menu is clicked:
	const handleClick = event => {
		setAnchorEl(event.currentTarget);
	};

	// Method for handling when the user clicks 'Logout':
	const handleLogout = () => {
		// Logout the user and close the menu:
		logout();
		handleClose();
	};

	// Render our nav bar:
	return (
		<div className={classes.root}>
			<AppBar
				color="secondary"
				position="fixed"
				className={clsx(classes.appBar, {
					[classes.appBarShift]: open
				})}
			>
				<Toolbar>
					<Grid
						justify="space-between"
						alignItems="center"
						container
					>
						<Grid item>
							{!open && authState.isAuthenticated ? (
								<IconButton
									edge="start"
									color="inherit"
									aria-label="Menu"
									onClick={handleDrawerOpen}
								>
									<MenuIcon />
								</IconButton>
							) : (<></>)}
						</Grid>
						<Grid item>
							<Logo />
						</Grid>
						<Grid item>
							{authState.isAuthenticated ? (
								<>
									<Box display="flex" alignItems="center" onClick={handleClick}>
										<Avatar
											alt="Profile"
											src={avatarUrl}
											className={classes.avatar}
										/>
										<DropDownArrow />
									</Box>
									<Menu
										id="simple-menu"
										anchorEl={anchorEl}
										keepMounted
										open={Boolean(anchorEl)}
										onClose={handleClose}
										getContentAnchorEl={null}
										anchorOrigin={{
											vertical: "bottom",
											horizontal: "center"
										}}
										transformOrigin={{
											vertical: "top",
											horizontal: "center"
										}}
									>
										<MenuItem onClick={handleLogout}>Logout</MenuItem>
									</Menu>
								</>
							) : (
									<></>
								)}
						</Grid>
					</Grid>
				</Toolbar>
			</AppBar>
		</div>
	);
}