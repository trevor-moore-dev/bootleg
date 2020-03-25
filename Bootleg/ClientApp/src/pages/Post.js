import React, { useState, useEffect } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import config from '../config.json';
import useRequest from '../hooks/useRequest';
import useAuth from "../hooks/useAuth";
import { useParams } from "react-router-dom";
import LazyLoad from 'react-lazyload';
import { formatDate } from "../helpers/dateHelper";
import { useLocation } from "react-router";
import {
    Box,
    IconButton,
    CardMedia,
    CardHeader,
    Card,
    CardActions,
    CardContent,
    Avatar,
    Grid,
    Link
} from '@material-ui/core';

// Trevor Moore
// CST-451
// 2/9/2020
// This is my own work.

// Making our styles:
const useStyles = makeStyles(theme => ({
    card: {
        width: "auto",
        marginBottom: theme.spacing(4)
    },
    rightCard: {
        width: "auto",
        maxHeight: "80vh"
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
    profileGrid: {
        display: 'none',
        position: 'fixed',
        left: '61%',
        width: '24%',
        [theme.breakpoints.up('md')]: {
            display: 'block',
        },
    },
    spaceGrid: {
        paddingTop: "48px!important",
        paddingBottom: "24px!important",
        paddingLeft: "12px!important",
        paddingRight: "12px!important",
    }
}));

// Home component for rendering the home page:
export default function Post() {
    // Create our styles and such, and create our state:
    const classes = useStyles();
    const [content, setContent] = useState([]);
    const { id } = useParams();
    const { get } = useRequest();
    const { authState } = useAuth();
    const location = useLocation();

    // useEffect hook for getting the content:
    useEffect(() => {
        async function getContent() {
            // Send post request to get the content
            const response = await get(config.CONTENT_GET_CONTENT_GET, {
                contentId: id
            });
            // On success set the data:
            if (response.success) {
                setContent(response.data);
            }
        }
        getContent();
        return () => { };
    }, []);

    // Return our markup:
    return (
        <Box className={classes.box}>
            <Grid className={classes.grid} container spacing={3}>
                <Grid item xs={8} className={`${classes.contentGrid} ${classes.spaceGrid}`}>
                    <Card className={classes.card}>
                        <CardHeader
                            avatar={
                                <LazyLoad>
                                    <Avatar className={classes.avatar} src={content.userProfilePicUri} />
                                </LazyLoad>
                            }
                            title={content.userName}
                            subheader={formatDate(content.datePostedUTC)}
                            className={classes.text}
                        />
                        {content.mediaUri ? (
                            <CardMedia>
                                {content.mediaType == 0 ? (
                                    <LazyLoad>
                                        <img src={content.mediaUri} alt="Image couldn't load or was deleted :(" className={classes.img} />
                                    </LazyLoad>
                                ) : (
                                        <LazyLoad>
                                            <video className={classes.video} loop controls autoPlay>
                                                <source src={content.mediaUri} type="video/mp4" />
                                                <source src={content.mediaUri} type="video/webm" />
                                                <source src={content.mediaUri} type="video/ogg" />
                                                <p className={classes.text}>Your browser does not support our videos :(</p>
                                            </video>
                                        </LazyLoad>
                                    )}
                            </CardMedia>) : (
                                <></>
                            )}
                        <CardContent>
                            <p className={classes.text}>{content.contentBody}</p>
                        </CardContent>
                        <CardActions disableSpacing>
                            <IconButton color="primary">
                                <ThumbUpAltIcon />
                            </IconButton>
                            <IconButton color="primary">
                                <ThumbDownAltIcon />
                            </IconButton>
                            <IconButton className={classes.iconButtons}>
                                <ChatBubbleIcon />
                            </IconButton>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs={4} className={`${classes.profileGrid} ${classes.spaceGrid}`}>
                    <Card className={classes.rightCard}>
                        <CardContent>
                            {content.comments && content.comments.length > 0 ? content.comments.map(comment => (



                                <div className={userId === message.userId ? classes.right : classes.left}>
                                    <LazyLoad>
                                        <Avatar className={userId === message.userId ? classes.rightAvatar : classes.leftAvatar} src={message.profilePicUri} />
                                    </LazyLoad>
                                    <Card className={userId === message.userId ? classes.rightCard : classes.leftCard}>
                                        <CardHeader
                                            disableTypography={true}
                                            title={<div className={userId === message.userId ? classes.darkHeaderText : classes.lightHeaderText}>{message.username}</div>}
                                            subheader={<div className={userId === message.userId ? classes.darkText : classes.lightText}>{message.messageBody}</div>}
                                        />
                                    </Card>
                                    <p className={classes.text}>Hello There! :)</p>
                                </div>

                            )) : <></>}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
