import React, { useState, useEffect } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import config from '../config.json';
import useRequest from '../hooks/useRequest';
import useAuth from "../hooks/useAuth";
import { Link as RouterLink } from 'react-router-dom';
import Carousel, { Dots } from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';
import LazyLoad from 'react-lazyload';
import {
    Box,
    Card,
    CardContent,
    Grid,
    Button,
    Avatar,
    Link
} from '@material-ui/core';

// Trevor Moore
// CST-451
// 2/9/2020
// This is my own work.

// Making our styles:
const useStyles = makeStyles(theme => ({
    card: {
        width: '25%',
        margin: '10px',
        [theme.breakpoints.up('md')]: {
            margin: '40px'
        },
    },
    avatar: {
        backgroundColor: "rgb(147,112,219)"
    },
    text: {
        color: theme.superb
    },
    link: {
        color: theme.general.medium,
        textDecoration: "none",
        cursor: "pointer",
        "&:hover": {
            textDecoration: "none",
            cursor: "pointer",
        }
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
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: "100%",
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(8),
        [theme.breakpoints.up('md')]: {
            paddingLeft: theme.spacing(20),
            paddingRight: theme.spacing(20),
        },
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
    media: {
        textAlign: 'center',
        height: '100px',
        backgroundColor: 'rgba(0,0,0,1)',
        [theme.breakpoints.up('md')]: {
            height: '300px',
        },
    },
    mediaContent: {
        width: '100%',
        height: '100%',
        outline: 'none',
        objectFit: 'cover'
    },
    spaceGrid: {
        paddingTop: "48px!important",
        paddingBottom: "24px!important",
        paddingLeft: "12px!important",
        paddingRight: "12px!important",
    },
    profileThing: {
        fontSize: '8px',
        display: 'grid'
    },
    container: {
        display: 'flex',
        flexGrow: 1,
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    mobileAvatar: {
        margin: 'auto'
    },
    ellipsis: {
        maxWidth: '60px',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden'
    },
    lightText: {
        color: theme.text
    },
    carousel: {
        marginBottom: '24px',
        width: '100%',
        display: 'block'
    },
}));

// Explore component for rendering the explore page:
export default function Explore() {
    // Create our styles and set our initial state:
    const classes = useStyles();
    const [users, setUsers] = useState([]);
    const { get, post } = useRequest();
    const { getUserId } = useAuth();
    const userId = getUserId();
    const [uploads, setUploads] = useState({});

    // useEffect hook for getting all content and all users on the app:
    useEffect(() => {
        async function getLiterallyAllContent() {
            // Make get request to grab the content data:
            const response = await get(config.CONTENT_GET_LITERALLY_ALL_CONTENT_GET);
            // On success set the state data:
            if (response.success) {
                setUploads(response.data);
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
        getLiterallyAllContent();
        getUsers();
        return () => { };
    }, []);

    // Return our markup:
    return (
        <Box className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs className={classes.container}>
                    <div className={classes.carousel}>
                        <Carousel
                            slidesPerPage={users && users.length < 7 ? users.length : 6}
                            infinite
                        >
                            {users && users.length > 0 && users.map(user =>
                                <div key={user.id} className={`${classes.profileThing} ${classes.lightText}`}>
                                    <Link
                                        className={classes.link}
                                        component={RouterLink}
                                        to={`/user/${user.id}`}>
                                        <Avatar className={classes.mobileAvatar} src={user.profilePicUri} />
                                    </Link>
                                    <div className={classes.ellipsis}>{user.username}</div>
                                </div>)}
                        </Carousel>
                    </div>
                    {uploads && uploads.length > 0 && uploads.map(content =>
                        <div key={content.id} className={`${classes.media} ${classes.card}`}>
                            <Link
                                className={classes.link}
                                component={RouterLink}
                                to={`/post/${content.id}`}>
                                {content.mediaType == 0 ?
                                    <LazyLoad>
                                        <img src={content.mediaUri} alt="Image couldn't load or was deleted :(" className={classes.mediaContent} />
                                    </LazyLoad>
                                    :
                                    <LazyLoad>
                                        <video className={classes.mediaContent} loop autoPlay>
                                            <source src={content.mediaUri} type="video/mp4" />
                                            <source src={content.mediaUri} type="video/webm" />
                                            <source src={content.mediaUri} type="video/ogg" />
                                            <p className={classes.text}>Your browser does not support our videos :(</p>
                                        </video>
                                    </LazyLoad>}
                            </Link>
                        </div>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
}
