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

const drawerWidth = 240;

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

export default function NavigationBar({ handleDrawerOpen, open }) {
  const classes = useStyles();
  const { logout, authState } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);

  useEffect(() => {
    let avatar = Cookies.get("Avatar-Url");
    if (avatar) setAvatarUrl(avatar);
    else setAvatarUrl("");
  }, [authState]);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

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