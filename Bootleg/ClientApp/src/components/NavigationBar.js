﻿import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Logo from "./Logo";
import useAuth from "../hooks/useAuth";
import useRequest from '../hooks/useRequest';
import config from '../config.json';
import { Link as RouterLink } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import {
	IconButton,
	Toolbar,
	AppBar,
	Link,
	Avatar,
	Tooltip,
	Badge,
} from "@material-ui/core";
import clsx from "clsx";
import ToggleTheme from '../components/ToggleTheme';
import MailIcon from '@material-ui/icons/Mail';
import SearchTwoToneIcon from '@material-ui/icons/SearchTwoTone';
import ExploreIcon from '@material-ui/icons/Explore';
import { useTheme } from "../containers/ThemeContext";
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness5Icon from '@material-ui/icons/Brightness5';
import Autosuggest from 'react-autosuggest';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

// Trevor Moore
// CST-451
// 12/9/2019
// This is my own work.

// Create CSS styles:
const useStyles = makeStyles(theme => ({
	search: {
		position: 'relative',
		borderRadius: theme.shape.borderRadius,
		backgroundColor: theme.palette.secondary.main,
		marginLeft: 0,
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			marginLeft: theme.spacing(4),
			marginRight: theme.spacing(4),
			width: 'auto',
		},
	},
	toggleTheme: {
		margin: '0 10px'
	},
	searchIcon: {
		width: theme.spacing(7),
		height: '100%',
		position: 'absolute',
		pointerEvents: 'none',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		zIndex: '1'
	},
	searchInput: {
		padding: theme.spacing(1, 1, 1, 7),
		transition: theme.transitions.create('width'),
		width: '100%',
		'&:before': {
			content: '\f002',
		},
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
	lightIcon: {
		color: "#A9A9A9"
	},
	text: {
		color: "dimgrey",
		marginLeft: "10px",
		"&:hover": {
			textDecoration: "none",
		}
	},
	noUnderline: {
		textDecoration: "none",
		"&:hover": {
			textDecoration: "none",
		}
	},
	iconButtons: {
		color: theme.general.light
	},
	avatarHeader: {
		height: '24px',
		width: '24px',
	},
	avatarPic: {
		padding: '12px'
	},
	avatarContainer: {
		height: '40px',
		width: '40px'
	},
	img: {
		height: "100%",
		width: "100%",
		borderRadius: "50%",
		textAlign: 'center',
		objectFit: 'cover'
	},
}));

// Navigation Bar component for the top of the web app:
export default function NavigationBar() {
	// Create our styles and declare our state properties:
	const classes = useStyles();
	const themeState = useTheme();
	const { logout, getUserId, authState } = useAuth();
	const userId = getUserId();
	const { get } = useRequest();
	const [value, setValue] = useState("");
	const [suggestions, setSuggestions] = useState([]);
	const [users, setUsers] = useState([]);

	// useEffect hook for getting all the user's content:
	useEffect(() => {
		async function getUsers() {
			// Make get request to grab all of the user data:
			const response = await get(config.USER_SEARCH_ALL_USERS_GET, {});
			// On success set the state data:
			if (response.success) {
				setUsers(response.data);
			}
		}
		getUsers();
		return () => { };
	}, []);

	// Method for handling when the user logs out:
	const handleLogout = () => {
		logout();
	};

	const escapeRegexCharacters = str => {
		return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	};

	const getSuggestions = val => {
		const escapedValue = escapeRegexCharacters(val.trim());
		if (escapedValue === '') {
			return [];
		}
		const regex = new RegExp('\\b' + escapedValue, 'i');
		return users.filter(user => regex.test(getSuggestionValue(user)));
	};

	const getSuggestionValue = suggestion => {
		return `${suggestion.username}`;
	};

	const renderSuggestion = suggestion => {
		return (
			<Link
				className={classes.noUnderline}
				href={`/user/${suggestion.id}`}>
				<span className='suggestion-content'>
					<span className='name'>
						<div className={classes.avatarContainer}>
							<img src={suggestion.profilePicUri} className={classes.img} />
						</div>
						<div className={classes.text}>
							{suggestion.username}
						</div>
					</span>
				</span>
			</Link>
		);
	};

	const onChange = (event, { newValue }) => {
		setValue(newValue);
	};

	const onSuggestionsFetchRequested = ({ value }) => {
		setSuggestions(getSuggestions(value));
	};

	const onSuggestionsClearRequested = () => {
		setSuggestions([]);
	};

	const inputProps = {
		placeholder: 'Search',
		value,
		onChange: onChange
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
					{authState.isAuthenticated &&
						<div className={`${classes.search} ${classes.sectionDesktop}`}>
							<Autosuggest
								className={classes.searchInput}
								suggestions={suggestions}
								onSuggestionsFetchRequested={onSuggestionsFetchRequested}
								onSuggestionsClearRequested={onSuggestionsClearRequested}
								getSuggestionValue={getSuggestionValue}
								renderSuggestion={renderSuggestion}
								inputProps={inputProps}
							/>
						</div>}
					{authState.isAuthenticated &&
						<div className={classes.sectionDesktop}>
							<Link
								component={RouterLink}
								to="/explore">
								<IconButton className={classes.iconButtons}>
									<ExploreIcon />
								</IconButton>
							</Link>
							<Link
								component={RouterLink}
								to="/messages">
								<IconButton className={classes.iconButtons}>
									<Badge color='secondary'>
										<MailIcon />
									</Badge>
								</IconButton>
							</Link>
							<Link
								className={classes.avatarPic}
								href={`/user/${userId}`}>
								<LazyLoad>
									<Avatar className={classes.avatarHeader} src={authState.user.profilePic} />
								</LazyLoad>
							</Link>
						</div>}
					<div className={`${classes.sectionDesktop} ${classes.toggleTheme}`}>
						<ToggleTheme />
					</div>
					{authState.isAuthenticated &&
						<Link
							component={RouterLink}
							to="/search"
							className={classes.sectionMobile}>
							<IconButton className={classes.lightIcon}>
								<SearchTwoToneIcon />
							</IconButton>
						</Link>}
					<IconButton
						onClick={() => themeState.toggle()}
						className={classes.sectionMobile}
					>
						{themeState.isDark ? <Brightness5Icon /> : <Brightness4Icon />}
					</IconButton>
					{authState.isAuthenticated &&
						<Tooltip title='Logout'>
							<IconButton
								onClick={handleLogout}
								className={classes.lightIcon}>
								<Badge color='secondary'>
									<ExitToAppIcon />
								</Badge>
							</IconButton>
						</Tooltip>}
				</Toolbar>
			</AppBar>
		</div>
	);
}