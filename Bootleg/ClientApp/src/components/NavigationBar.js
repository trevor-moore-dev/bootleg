import React, { useState, useEffect } from "react";
import { makeStyles, fade } from "@material-ui/core/styles";
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
	Badge,
	Tooltip
} from "@material-ui/core";
import clsx from "clsx";
import ToggleTheme from '../components/ToggleTheme';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import ExploreIcon from '@material-ui/icons/Explore';
import { useTheme } from "../containers/ThemeContext";
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness5Icon from '@material-ui/icons/Brightness5';
import Autosuggest from 'react-autosuggest';

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
	text: {
		color: "dimgrey",
		marginLeft: "10px",
	},
	iconButtons: {
		color: theme.general.light
	},
	img: {
		maxHeight: "45px",
		borderRadius: "50%"
	},
}));

// Navigation Bar component for the top of the web app:
export default function NavigationBar() {
	// Create our styles and declare our state properties:
	const classes = useStyles();
	const themeState = useTheme();
	const { logout, authState } = useAuth();
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

	// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
	const escapeRegexCharacters = str => {
		return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	}

	const getSuggestions = val => {
		const escapedValue = escapeRegexCharacters(val.trim());
		if (escapedValue === '') {
			return [];
		}
		const regex = new RegExp('\\b' + escapedValue, 'i');
		return users.filter(user => regex.test(getSuggestionValue(user)));
	}

	const getSuggestionValue = suggestion => {
		return `${suggestion.username}`;
	}

	// Use your imagination to render suggestions.
	const renderSuggestion = suggestion => {
		return (
			<span className='suggestion-content'>
				<span className='name'>
					<img src={suggestion.profilePicUri} className={classes.img} />
					<div className={classes.text}>
						{suggestion.username}
					</div>
				</span>
			</span>
		);
	};

	const onChange = (event, { newValue }) => {
		setValue(newValue);
	};

	// Autosuggest will call this function every time you need to update suggestions.
	// You already implemented this logic above, so just use it.
	const onSuggestionsFetchRequested = ({ value }) => {
		setSuggestions(getSuggestions(value));
	};

	// Autosuggest will call this function every time you need to clear suggestions.
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
					<div className={classes.search}>
						<Autosuggest
							className={classes.searchInput}
							suggestions={suggestions}
							onSuggestionsFetchRequested={onSuggestionsFetchRequested}
							onSuggestionsClearRequested={onSuggestionsClearRequested}
							getSuggestionValue={getSuggestionValue}
							renderSuggestion={renderSuggestion}
							inputProps={inputProps}
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