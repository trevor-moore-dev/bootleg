import React, { useState } from "react";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import HomeIcon from "@material-ui/icons/Home";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import { Link } from "react-router-dom";
import EqualizerIcon from "@material-ui/icons/Equalizer";
import DataIcon from "@material-ui/icons/DataUsage";
import CreateIcon from "@material-ui/icons/Create";
import { useLocation } from "react-router";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth,
    border: "none",
	backgroundColor: theme.palette.secondary.light,
	color: theme.palette.primary.main
  },
  title: {
    paddingLeft: theme.spacing(1)
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "space-between",
	backgroundColor: theme.palette.secondary.light,
	color: theme.palette.primary.main,
    boxShadow:
      "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);"
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  },
  icon: {
	  color: theme.palette.primary.light
  },
  nested: {
    paddingLeft: theme.spacing(4)
  }
}));

export default function Sidebar({ open, handleDrawerClose }) {
  const classes = useStyles();
  const location = useLocation();

  return (
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="left"
      open={open}
      classes={{
        paper: classes.drawerPaper
      }}
    >
	  <div className={classes.drawerHeader}>
		<IconButton onClick={handleDrawerClose}>
		  <ChevronLeftIcon className={classes.icon} />
		</IconButton>
      </div>
      <Divider />
		<List>
		<ListItem
			button
			component={Link}
			to="/"
			selected={location.pathname === "/"}
		>
			<ListItemIcon className={classes.icon}>
				<HomeIcon />
			</ListItemIcon>
			<ListItemText primary={"Home"} />
		</ListItem>
		<ListItem
			button
			component={Link}
			to="/"
			selected={location.pathname === "/test1"}
		>
			<ListItemIcon className={classes.icon}>
				<DataIcon />
			</ListItemIcon>
			<ListItemText primary={"Bootleg"} />
		</ListItem>
		<ListItem
			button
			component={Link}
			to="/"
			selected={location.pathname === "/test2"}
		>
			<ListItemIcon className={classes.icon}>
				<EqualizerIcon />
			</ListItemIcon>
			<ListItemText primary={"Account"} />
		</ListItem>
		<ListItem
			button
			component={Link}
			to="/"
			selected={location.pathname === "/test3"}
		>
			<ListItemIcon className={classes.icon}>
				<CreateIcon className={classes.icon} />
			</ListItemIcon>
			<ListItemText primary={"Messages"} />
		</ListItem>
		</List>
    </Drawer>
  );
}