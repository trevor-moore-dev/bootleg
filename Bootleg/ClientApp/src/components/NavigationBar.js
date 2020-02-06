import React from "react";
import { makeStyles, fade } from "@material-ui/core/styles";
import Logo from "./Logo";
import useAuth from "../hooks/useAuth";
import { Link as RouterLink } from 'react-router-dom';
import {
	Menu,
	MenuItem,
	IconButton,
	Toolbar,
	AppBar,
	Link,
	Badge,
	Tooltip,
	InputBase
} from "@material-ui/core";
import clsx from "clsx";
import ToggleTheme from '../components/ToggleTheme';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import ExploreIcon from '@material-ui/icons/Explore';
import MoreIcon from '@material-ui/icons/MoreVert';
import { useTheme } from "../containers/ThemeContext";
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness5Icon from '@material-ui/icons/Brightness5';

// Trevor Moore
// CST-451
// 12/9/2019
// This is my own work.

// Create CSS styles:
const useStyles = makeStyles(theme => ({
	search: {
		position: 'relative',
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.common.white, 0.15),
		'&:hover': {
			backgroundColor: fade(theme.palette.common.white, 0.25),
		},
		marginLeft: 0,
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			marginLeft: theme.spacing(4),
			marginRight: theme.spacing(4),
			width: 'auto',
		},
	},
	searchIcon: {
		width: theme.spacing(7),
		height: '100%',
		position: 'absolute',
		pointerEvents: 'none',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	searchInput: {
		padding: theme.spacing(1, 1, 1, 7),
		transition: theme.transitions.create('width'),
		width: '100%',
		[theme.breakpoints.up('md')]: {
			width: 200,
		},
	},
	sectionDesktop: {
		display: 'none',
		[theme.breakpoints.up('md')]: {
			display: 'flex',
		},
	},
	sectionMobile: {
		color: "#A9A9A9",
		display: 'flex',
		[theme.breakpoints.up('md')]: {
			display: 'none',
		},
	},
	text: {
		color: theme.text
	},
	iconButtons: {
		color: theme.general.light
	}
}));

// Nav Bar component for the top of the web app:
export default function NavigationBar() {
	// Create our styles and declare our state properties:
	const classes = useStyles();
	const themeState = useTheme();
	const { logout, authState } = useAuth();

	// Method for handling when the user clicks 'Logout':
	const handleLogout = () => {
		// Logout the user:
		logout();
	};

	// Render our nav bar:
	return (
		<div className={classes.root}>
			<AppBar
				color="secondary"
				position="fixed"
				className={clsx(classes.appBar)}
			>
				<Toolbar disableGutters={true}>
					<Logo />
					<div className={classes.search}>
						<div className={classes.searchIcon}>
							<SearchIcon />
						</div>
						<InputBase
							placeholder="Search"
							classes={{ input: classes.searchInput }}
						/>
					</div>
					<div className={classes.sectionDesktop}>
						<Link
							component={RouterLink}
							to="/explore">
							<Tooltip title="Explore">
								<IconButton className={classes.iconButtons}>
									<ExploreIcon />
								</IconButton>
							</Tooltip>
						</Link>
						<Link
							component={RouterLink}
							to="/messages">
							<Tooltip title="Messages">
								<IconButton className={classes.iconButtons}>
									<Badge badgeContent={4} color='secondary'>
										<MailIcon />
									</Badge>
								</IconButton>
							</Tooltip>
						</Link>
						<Link
							component={RouterLink}
							to="/my-account">
							<Tooltip title="Account">
								<IconButton className={classes.iconButtons}>
									<AccountCircle />
								</IconButton>
							</Tooltip>
						</Link>
					</div>
					<div className={classes.sectionDesktop}>
						<ToggleTheme />
					</div>
					<IconButton
						onClick={() => themeState.toggle()}
						className={classes.sectionMobile}
					>
						{themeState.isDark ? <Brightness5Icon /> : <Brightness4Icon />}
					</IconButton>
				</Toolbar>
			</AppBar>
		</div>
	);
}