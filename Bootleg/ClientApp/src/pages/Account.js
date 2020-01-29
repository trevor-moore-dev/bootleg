import React, { useState, useEffect } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import config from '../config.json';
import useRequest from '../hooks/useRequest';
import useAuth from "../hooks/useAuth";
import LazyLoad from 'react-lazyload';
import { formatDate } from "../helpers/dateHelper";
import {
    Box,
    IconButton,
    CardMedia,
    CardHeader,
    Card,
    CardActions,
    CardContent,
    Avatar,
    GridList,
    GridListTile,
    Paper,
    Divider,
    Grid,
    Link
} from '@material-ui/core';

// Trevor Moore
// CST-451
// 12/9/2019
// This is my own work.

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
    avatar: {
        backgroundColor: "rgb(147,112,219)"
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
    text: {
        color: theme.text
    },
    divider: {
        backgroundColor: theme.divider.backgroundColor,
        margin: '25px 15% 25px 15%',
    },
    video: {
        outline: 'none',
        width: '100%'
    },
    img: {
        maxHeight: '300px',
        maxWidth: '100%',
    },
    media: {
        textAlign: 'center',
        display: 'block',
        height: '300px',
    }
}));

// Home component for rendering the home page:
export default function Account() {
    const classes = useStyles();
    const [user, setUser] = useState({});
    const [uploads, setUploads] = useState([]);
    const { get } = useRequest();
    const { authState } = useAuth();

    useEffect(() => {
        async function getUserContent() {
            const response = await get(config.USER_GET_USER_CONTENT_GET, {
                userId: authState.user.id
            });
            if (response.success) {
                setUser(response.data.item1);
                setUploads(response.data.item2);
            }
        }
        getUserContent();
        return () => { };
    }, []);

    return (
        <Box className={classes.root}>
            <div className={classes.container}>
                <Avatar className={classes.avatar} src={user.profilePicUri} />
                <div>{user.username}</div>
                <div>{user.bio}</div>
            </div>
            <Divider className={classes.divider} ariant="middle" />
            <Grid container spacing={3}>
                <Grid item xs className={classes.container}>
                    {uploads && uploads.length > 0 ? uploads.map(content => (
                        <Card key={content.id} className={classes.card}>
                            <CardHeader
                                action={
                                    <IconButton color="inherit">
                                        <DeleteIcon />
                                    </IconButton>
                                }
                                subheader={formatDate(content.datePostedUTC)}
                                className={classes.text}
                            />
                            {content.mediaUri ? (
                                <CardMedia
                                    className={classes.media}
                                >
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
                                <p className={classes.text}></p>
                            </CardContent>
                        </Card>
                    )) :
                        <Card className={classes.card}>
                            <CardContent>
                                <p className={classes.text}>Welcome Boomer! Feel free to <Link className={classes.link}>post some content</Link>.</p>
                            </CardContent>
                        </Card>}
                </Grid>
            </Grid>
        </Box>
    );
}
