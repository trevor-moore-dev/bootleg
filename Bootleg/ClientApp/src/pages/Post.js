import React, { useState, useEffect } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import config from '../config.json';
import useRequest from '../hooks/useRequest';
import useAuth from "../hooks/useAuth";
import SendIcon from '@material-ui/icons/Send';
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
    TextField,
    CardActions,
    CardContent,
    Avatar,
    Grid
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
    commentContent: {
        overflow: 'scroll'
    },
    avatar: {
        backgroundColor: "rgb(147,112,219)"
    },
    contentText: {
        color: theme.text,
    },
    text: {
        color: theme.text,
        textAlign: 'center',
        marginBottom: '10px'
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
    commentContainer: {
        display: 'flex',
        alignItems: 'center'
    },
    commentInput: {
        width: "100%"
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
    },
    uploadButton: {
        marginLeft: "10px",
        backgroundColor: theme.general.medium,
        color: "rgb(255,255,255)",
        "&:hover": {
            backgroundColor: "rgb(113,80,181)"
        }
    },
}));

// Home component for rendering the home page:
export default function Post() {
    // Create our styles and such, and create our state:
    const classes = useStyles();
    const [postedContent, setPostedContent] = useState({});
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const { id } = useParams();
    const { get, post } = useRequest();
    const { authState } = useAuth();
    const location = useLocation();

    // useEffect hook for getting the content:
    useEffect(() => {
        async function getPost() {
            // Send post request to get the content
            const response = await get(config.CONTENT_GET_CONTENT_GET, {
                contentId: id
            });
            // On success set the data:
            if (response.success) {
                setPostedContent(response.data);
                setComments(response.data.comments)
            }
        }
        getPost();
        return () => { };
    }, []);

    const handleNewCommentChange = e => {
        setNewComment(e.target.value);
    };

    const postComment = async () => {
        // If newComment is truthy, post it:
        if (newComment) {
            // Send post request to AUTHENTICATION_AUTHENTICATE_USER_POST endpoint and await response:
            const response = await post(config.CONTENT_POST_COMMENT_POST, {
                Id: id,
                Data: newComment
            });
            // If Request was successful:
            if (response.success) {
                setComments(response.data);
            }
        }
    };

    // Return our markup:
    return (
        <Box className={classes.box}>
            <Grid className={classes.grid} container spacing={3}>
                <Grid item xs={8} className={`${classes.contentGrid} ${classes.spaceGrid}`}>
                    <Card className={classes.card}>
                        <CardHeader
                            avatar={
                                <LazyLoad>
                                    <Avatar className={classes.avatar} src={postedContent.userProfilePicUri} />
                                </LazyLoad>
                            }
                            title={postedContent.userName}
                            subheader={formatDate(postedContent.datePostedUTC)}
                            className={classes.contentText}
                        />
                        {postedContent.mediaUri &&
                            <CardMedia>
                                {postedContent.mediaType == 0 ? (
                                    <LazyLoad>
                                        <img src={postedContent.mediaUri} alt="Image couldn't load or was deleted :(" className={classes.img} />
                                    </LazyLoad>
                                ) : (
                                        <LazyLoad>
                                            <video className={classes.video} loop controls autoPlay>
                                                <source src={postedContent.mediaUri} type="video/mp4" />
                                                <source src={postedContent.mediaUri} type="video/webm" />
                                                <source src={postedContent.mediaUri} type="video/ogg" />
                                                <p className={classes.contentText}>Your browser does not support our videos :(</p>
                                            </video>
                                        </LazyLoad>
                                    )}
                            </CardMedia>}
                        <CardContent>
                            <p className={classes.contentText}>{postedContent.contentBody}</p>
                        </CardContent>
                        <CardActions disableSpacing>
                            <IconButton color="primary">
                                <ThumbUpAltIcon />
                            </IconButton>
                            <IconButton color="primary">
                                <ThumbDownAltIcon />
                            </IconButton>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs={4} className={`${classes.profileGrid} ${classes.spaceGrid}`}>
                    <Card className={classes.rightCard}>
                        <CardContent className={classes.commentContent}>
                            {comments && comments.length > 0 ? comments.map(comment =>
                                <div className={classes.comment}>
                                    <LazyLoad>
                                        <Avatar className={classes.commentAvatar} src={comment.userProfilePicUri} />
                                    </LazyLoad>
                                    <Card className={classes.commentCard}>
                                        <CardHeader
                                            disableTypography={true}
                                            title={<div className={classes.commentUsername}>{comment.userName}</div>}
                                            subheader={<div className={classes.commentBody}>{comment.contentBody}</div>}
                                        />
                                    </Card>
                                </div>
                            ) : (
                                    <div className={classes.text}>No comments yet...</div>
                                )}
                            <Box className={classes.commentContainer}>
                                <TextField
                                    multiline
                                    rowsMax="8"
                                    className={classes.commentInput}
                                    value={newComment}
                                    onChange={handleNewCommentChange}
                                    label="Post a Comment :)"
                                    variant="outlined"
                                />
                                <IconButton
                                    className={classes.uploadButton}
                                    onClick={postComment}>
                                    <SendIcon />
                                </IconButton>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
