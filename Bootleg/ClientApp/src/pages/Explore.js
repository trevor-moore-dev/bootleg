import React, { useState, useEffect } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import config from '../config.json';
import useRequest from '../hooks/useRequest';
import useAuth from "../hooks/useAuth";
import { Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    Grid,
    Button,
    Link
} from '@material-ui/core';

// Trevor Moore
// CST-451
// 2/9/2020
// This is my own work.

const useStyles = makeStyles(theme => ({
    card: {
        width: "auto",
        marginBottom: theme.spacing(4)
    },
    avatar: {
        backgroundColor: "rgb(147,112,219)"
    },
    text: {
        color: theme.text
    },
    link: {
        color: theme.general.medium,
        cursor: "pointer"
    },
    video: {
        outline: "none",
        width: "100%"
    },
    img: {
        width: "100%"
    },
    iconButtons: {
        color: "#A9A9A9"
    },
    box: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    grid: {
        [theme.breakpoints.up('md')]: {
            width: "70%"
        },
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
    }
}));

// Explore component for rendering the explore page:
export default function Explore() {
    // Create our styles and set our initial state:
    const classes = useStyles();
    const [users, setUsers] = useState([]);
    const { get, post } = useRequest();
    const { getUserId } = useAuth();
    const userId = getUserId();
    const [loggedInUser, setLoggedInUser] = useState({});

    // useEffect hook for getting logged in user and all users on the app:
    useEffect(() => {
        async function getLoggedInUser() {
            // Make get request to grab the user data:
            const response = await get(config.USER_GET_USER_GET, {
                userId: userId
            });
            // On success set the state data:
            if (response.success) {
                setLoggedInUser(response.data);
            }
        }
        async function getUsers() {
            // Make get request to grab all of the user data:
            const response = await get(config.USER_SEARCH_ALL_USERS_GET, {});
            // On success set the state data:
            if (response.success) {
                setUsers(response.data);
            }
        }
        getLoggedInUser();
        getUsers();
        return () => { };
    }, []);

    // Method for following a user:
    const followUser = async (userId) => {
        // Make post request to update the user data:
        const response = await post(config.USER_FOLLOW_USER_POST, {
            Id: userId,
            Data: userId
        });
        // On success set the state data:
        if (response.success) {
            setLoggedInUser(response.data);
        }
    };

    // Method for unfollowing a user:
    const unfollowUser = async (userId) => {
        // Make post request to update the user data:
        const response = await post(config.USER_UNFOLLOW_USER_POST, {
            Id: userId,
            Data: userId
        });
        // On success set the state data:
        if (response.success) {
            setLoggedInUser(response.data);
        }
    };

    // Return our markup:
    return (
        <Box className={classes.box}>
            <Grid className={classes.grid} container spacing={3}>
                <Grid item xs={12} className={`${classes.contentGrid} ${classes.spaceGrid}`}>
                    {users && users.length > 0 ? users.map(user =>
                        (user.id !== userId ?
                            <Card key={user.id} className={classes.card}>
                                <CardContent>
                                    <Link
                                        component={RouterLink}
                                        to={`/account/${user.id}`}>
                                        <p className={classes.text}>{user.username}</p>
                                    </Link>

                                    {loggedInUser && loggedInUser.followingIds && loggedInUser.followingIds.length > 0 ?
                                        (loggedInUser.followingIds.includes(user.id) ?
                                            <Button variant="contained" onClick={() => unfollowUser(user.id)}>Unfollow</Button> :
                                            <Button variant="contained" onClick={() => followUser(user.id)}>Follow</Button>) :
                                        <Button variant="contained" onClick={() => followUser(user.id)}>Follow</Button>}
                                </CardContent>
                            </Card> : <div key={user.id}></div>)
                    ) :
                        <></>}
                </Grid>
            </Grid>
        </Box>
    );
}
