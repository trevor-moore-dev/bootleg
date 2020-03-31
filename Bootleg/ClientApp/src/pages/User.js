import React, { useState, useEffect } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import config from '../config.json';
import useRequest from '../hooks/useRequest';
import useAuth from "../hooks/useAuth";
import LazyLoad from 'react-lazyload';
import { formatDate } from "../helpers/dateHelper";
import { useParams } from "react-router-dom";
import { Link as RouterLink } from 'react-router-dom';
import {
    Box,
    IconButton,
    CardMedia,
    CardHeader,
    Card,
    Avatar,
    Button,
    Divider,
    Grid,
    Link
} from '@material-ui/core';

// Trevor Moore
// CST-451
// 2/9/2020
// This is my own work.

// Create CSS styles:
const useStyles = makeStyles(theme => ({
    root: {
        paddingTop: theme.spacing(5)
    },
    container: {
        display: 'flex',
        flexGrow: 1,
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    card: {
        [theme.breakpoints.up('sm')]: {
            width: '80%',
        },
        [theme.breakpoints.up('md')]: {
            width: '25%',
        },
        margin: '10px'
    },
    avatar: {
        backgroundColor: 'rgb(147,112,219)',
        width: theme.spacing(20),
        height: theme.spacing(20),
    },
    mousePointer: {
        '&:hover': {
            mouse: "pointer"
        },
    },
    text: {
        color: theme.text
    },
    divider: {
        backgroundColor: theme.divider.backgroundColor,
        margin: '25px 15% 25px 15%',
    },
    video: {
        outline: 'none',
        width: '100%',
        height: '100%'
    },
    img: {
        maxHeight: '300px',
        maxWidth: '100%',
        verticalAlign: 'middle',
    },
    media: {
        textAlign: 'center',
        display: 'block',
        height: '300px',
        backgroundColor: 'rgba(0,0,0,1)',
        lineHeight: '300px',
    },
    accountDetailsContainer: {
        flexDirection: 'column',
        display: 'flex',
    },
}));

// User component for rendering someone else's profile:
export default function User() {
    // Create our CSS classes and also setting the state data initially:
    const classes = useStyles();
    const { id } = useParams();
    const { getUserId } = useAuth();
    const userId = getUserId();
    const [uploads, setUploads] = useState([]);
    const { get, post } = useRequest();
    const [user, setUser] = useState({});
    const [isFollowing, setIsFollowing] = useState(false);

    // useEffect hook for getting the user and all the content they should have on their feet.
    useEffect(() => {
        async function getLoggedInUser() {
            // Send get request to get the user:
            const response = await get(config.USER_GET_USER_GET, {
                userId: userId
            });
            // On success set the data:
            if (response.success) {
                if (response.data.followingIds) {
                    setIsFollowing(response.data.followingIds.includes(id));
                }
            }
        }
        async function getUser() {
            // Send get request to get the user:
            const response = await get(config.USER_GET_USER_CONTENT_GET, {
                userId: id
            });
            // On success set the data:
            if (response.success) {
                setUser(response.data.item1);
                setUploads(response.data.item2);
            }
        }
        getLoggedInUser();
        getUser();
        return () => { };
    }, []);

    // Method for following a user:
    const followUser = async () => {
        // Send post request to the user:
        const response = await post(config.USER_FOLLOW_USER_POST, {
            Id: id,
            Data: userId
        });
        // On success set the data:
        if (response.success) {
            if (response.data.followingIds) {
                setIsFollowing(response.data.followingIds.includes(id));
            }
        }
    };

    // Method for unfollowing a user:
    const unfollowUser = async () => {
        // Send post request to the user:
        const response = await post(config.USER_UNFOLLOW_USER_POST, {
            Id: id,
            Data: userId
        });
        // On success set the data:
        if (response.success) {
            if (response.data.followingIds) {
                setIsFollowing(response.data.followingIds.includes(id));
            }
        }
    };

    // Method for messaging a user:
    const messageUser = async (id1, id2) => {
        // Make post request to send a new message (this invokes all websocket connections to this group):
        const response = await post(config.MESSAGING_CREATE_CONVERSATION_POST, {
            Data: [
                id1,
                id2
            ]
        });
    };

    // Return our markup:
    return (
        <Box className={classes.root}>
            <div className={classes.container}>
                <Avatar className={classes.avatar} src={user.profilePicUri} />
                <div className={classes.accountDetailsContainer}>
                    <div className={classes.text}>{user.username}</div>
                    <div className={classes.text}>{user.bio}</div>
                    <div className={classes.text}>{user.email}</div>
                    <div className={classes.text}>{user.phone}</div>
                    {isFollowing ?
                        <Button variant="contained" onClick={unfollowUser}>Unfollow</Button> :
                        <Button variant="contained" onClick={followUser}>Follow</Button>}
                    <Link
                        component={RouterLink}
                        onClick={() => messageUser(userId, id)}
                        to="/messages">
                        <Button variant="contained">Message</Button>
                    </Link>

                </div>
            </div>
            <Divider className={classes.divider} ariant="middle" />
            <Grid container spacing={3}>
                <Grid item xs className={classes.container}>
                    {uploads && uploads.length > 0 && uploads.map(content => (
                        <Card key={content.id} className={classes.card}>
                            <CardHeader
                                action={
                                    <IconButton color="inherit">
                                        <MoreVertIcon />
                                    </IconButton>
                                }
                                subheader={formatDate(content.datePostedUTC)}
                                className={classes.text}
                            />
                            {content.mediaUri &&
                                <CardMedia className={classes.media}>
                                    {content.mediaType == 0 ? (
                                        <LazyLoad>
                                            <img src={content.mediaUri} alt="Image couldn't load or was deleted :(" className={classes.img} />
                                        </LazyLoad>
                                    ) : (
                                            <LazyLoad>
                                                <video className={classes.video} loop autoPlay>
                                                    <source src={content.mediaUri} type="video/mp4" />
                                                    <source src={content.mediaUri} type="video/webm" />
                                                    <source src={content.mediaUri} type="video/ogg" />
                                                    <p className={classes.text}>Your browser does not support our videos :(</p>
                                                </video>
                                            </LazyLoad>
                                        )}
                                </CardMedia>}
                        </Card>))}
                </Grid>
            </Grid>
        </Box>
    );
}