import React from "react";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MailIcon from '@material-ui/icons/Mail';
import HomeIcon from '@material-ui/icons/Home';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import { Link } from "react-router-dom";
import { useLocation } from "react-router";

// Trevor Moore
// CST-451
// 12/9/2019
// Coded in collaboration with Jordan Riley at OpportunityHack 2019. Class is "boiler plate" / standard / reusable code.

// Define our drawer width:
const drawerWidth = 240;

// Create CSS styles:
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

// Sidebar component for rendering our sidebar:
export default function Sidebar({ open, handleDrawerClose }) {
  // Create our styles to use and the location for getting the current url:
  const classes = useStyles();
  const location = useLocation();

  // Render our markup:
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
            <SearchIcon />
          </ListItemIcon>
          <ListItemText primary={"Explore"} />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/"
          selected={location.pathname === "/test2"}
        >
          <ListItemIcon className={classes.icon}>
            <AddCircleOutlineIcon />
          </ListItemIcon>
          <ListItemText primary={"Create Post"} />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/"
          selected={location.pathname === "/test3"}
        >
          <ListItemIcon className={classes.icon}>
            <MailIcon />
          </ListItemIcon>
          <ListItemText primary={"Messages"} />
        </ListItem>
        <ListItem
            button
            component={Link}
            to="/"
            selected={location.pathname === "/test4"}
        >
            <ListItemIcon className={classes.icon}>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary={"Account"} />
        </ListItem>
      </List>
    </Drawer>
  );
}