import React from "react";
import { makeStyles, fade } from "@material-ui/core/styles";
import Logo from "./Logo";
import useAuth from "../hooks/useAuth";
import { Menu, MenuItem, IconButton, Toolbar, AppBar } from "@material-ui/core";
import '../resources/css/site.css';
import clsx from "clsx";
import ToggleTheme from '../components/ToggleTheme';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
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
	inputRoot: {
		color: theme.palette.secondary.main,
	},
	inputInput: {
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
		display: 'flex',
		[theme.breakpoints.up('md')]: {
			display: 'none',
		},
	}
}));

// Nav Bar component for the top of the web app:
export default function NavigationBar({ handleDrawerOpen, open }) {
	// Create our styles and declare our state properties:
	const classes = useStyles();
	const themeState = useTheme();
	const { logout, authState } = useAuth();
	const [anchorEl, setAnchorEl] = React.useState(null);
	const isMenuOpen = Boolean(anchorEl);

	// Method for handling when the user clicks 'Logout':
	const handleLogout = () => {
		// Logout the user:
		logout();
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleMenuOpen = event => {
		setAnchorEl(event.currentTarget);
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
					<div className={classes.sectionDesktop}>
						<ToggleTheme />
					</div>
					<Logo />
					<div className={classes.search}>
						<div className={classes.searchIcon}>
							<SearchIcon />
						</div>
						<InputBase
							placeholder="Search"
							classes={{
								root: classes.inputRoot,
								input: classes.inputInput,
							}}
						/>
					</div>
					<div className={classes.sectionDesktop}>
						<IconButton color="inherit">
							<Badge badgeContent={4} color="secondary">
								<MailIcon />
							</Badge>
						</IconButton>
						<IconButton color="inherit">
							<AccountCircle />
						</IconButton>
					</div>
					<div className={classes.sectionMobile}>
						<IconButton
							onClick={handleMenuOpen}
							color="inherit"
						>
							<MoreIcon />
						</IconButton>
					</div>
				</Toolbar>
			</AppBar>
			<Menu
				anchorEl={anchorEl}
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
				open={isMenuOpen}
				onClose={handleMenuClose}
			>
				<MenuItem>
					<IconButton color="inherit">
						<Badge badgeContent={4} color="secondary">
							<MailIcon />
						</Badge>
					</IconButton>
					<p>Messages</p>
				</MenuItem>
				<MenuItem>
					<IconButton color="inherit">
						<AccountCircle />
					</IconButton>
					<p>Account</p>
				</MenuItem>
				<MenuItem onClick={() => themeState.toggle()}>
					<IconButton color="inherit">
						{themeState.isDark ? <Brightness5Icon /> : <Brightness4Icon />}
					</IconButton>
					<p>{themeState.isDark ? 'Light Mode' : 'Dark Mode'}</p>
				</MenuItem>
			</Menu>
		</div>
	);
}