import React, { useState, useEffect } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import config from '../config.json';
import useRequest from '../hooks/useRequest';
import useAuth from "../hooks/useAuth";
import { Link as RouterLink } from 'react-router-dom';
import Autosuggest from 'react-autosuggest';
import {
    Box,
    Card,
    CardContent,
    Grid,
    Link,
} from '@material-ui/core';
import { useTheme } from "../containers/ThemeContext";

// Trevor Moore
// CST-451
// 2/9/2020
// This is my own work.

// Making our styles:
const useStyles = makeStyles(theme => ({
    search: {
        padding: theme.spacing(2),
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.secondary.main,
        width: '100%',
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
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
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
    card: {
        width: "auto",
    },
    avatar: {
        backgroundColor: "rgb(147,112,219)"
    },
    text: {
        color: theme.text,
        marginLeft: '15px'
    },
    link: {
        color: theme.general.medium,
        cursor: "pointer"
    },
    iconButtons: {
        color: "#A9A9A9"
    },
    box: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    contentGrid: {
        [theme.breakpoints.down('sm')]: {
            width: "100%",
            maxWidth: "100%",
            flexBasis: "100%"
        },
        '&::-webkit-scrollbar': {
            display: 'none'
        },
    },
    spaceGrid: {
        paddingTop: "48px!important",
        paddingBottom: "24px!important",
        paddingLeft: "12px!important",
        paddingRight: "12px!important",
    },
    lightText: {
        color: theme.text
    },
    test: {
        zIndex: '1'
    }
}));

// Explore component for rendering the search page:
export default function Search() {
    // Create our styles and declare our state properties:
    const classes = useStyles();
    const themeState = useTheme();
    const { getUserId, authState } = useAuth();
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
                component={RouterLink}
                to={`/user/${suggestion.id}`}>
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

    // Return our markup:
    return (
        <Box className={`${classes.box} ${classes.sectionMobile}`}>
            <Grid container spacing={3}>
                <Grid item xs={12} className={`${classes.contentGrid} ${classes.spaceGrid}`}>
                    <Card className={classes.test}>
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
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
