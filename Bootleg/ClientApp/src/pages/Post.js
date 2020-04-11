import React, { useState, useEffect } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import config from '../config.json';
import useRequest from '../hooks/useRequest';
import useAuth from "../hooks/useAuth";
import SendIcon from '@material-ui/icons/Send';
import { useParams } from "react-router-dom";
import LazyLoad from 'react-lazyload';
import { formatDate } from "../helpers/dateHelper";
import { Link as RouterLink } from 'react-router-dom';
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
    Link,
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
    },
    commentContent: {
        maxHeight: "70vh",
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
        textDecoration: "none",
        color: theme.general.medium,
        cursor: "pointer",
        "&:hover": {
            textDecoration: "none",
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
        alignItems: 'center',
        margin: '0 16px 16px 16px'
    },
    commentInput: {
        width: "100%"
    },
    commentCard: {
        marginBottom: '15px',
    },
    contentGrid: {
        [theme.breakpoints.down('sm')]: {
            width: "100%",
            maxWidth: "100%",
            flexBasis: "100%",
            marginBottom: "120px"
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
    mobileOnly: {
        display: 'block',
        [theme.breakpoints.up('md')]: {
            display: 'none',
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
    stats: {
        paddingLeft: '4px',
        fontSize: '16px'
    }
}));

// Home component for rendering the home page:
export default function Post() {
    // Create our styles and such, and create our state:
    const classes = useStyles();
    const [postedContent, setPostedContent] = useState({});
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [hasLiked, setHasLiked] = useState(false);
    const [hasDisliked, setHasDisliked] = useState(false);
    const [likes, setLikes] = useState([]);
    const [dislikes, setDislikes] = useState([]);
    const { id } = useParams();
    const { get, post } = useRequest();
    const { getUserId, storeId } = useAuth();
    const userId = getUserId();

    // useEffect hook for getting the content:
    useEffect(() => {
        async function getPost() {
            // Save the id in the store so other components can use it:
            storeId(id);
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
        async function getUserLikesAndDislikes() {
            // Send get request to get the user:
            const response = await get(config.USER_GET_USER_GET, {
                userId: userId
            });
            // On success set the data:
            if (response.success) {
                if (response.data.likedContentIds) {
                    setHasLiked(response.data.likedContentIds.includes(id));
                    setLikes(response.data.likedContentIds || []);
                }
                if (response.data.dislikedContentIds) {
                    setHasDisliked(response.data.dislikedContentIds.includes(id));
                    setDislikes(response.data.dislikedContentIds || []);
                }
            }
        }
        getPost();
        getUserLikesAndDislikes();
        return () => { };
    }, []);

    // State change method for new comments:
    const handleNewCommentChange = e => {
        setNewComment(e.target.value);
    };

    // Method for posting a new comment:
    const postComment = async () => {
        // If newComment is truthy, post it:
        if (newComment) {
            // Send post request to AUTHENTICATION_AUTHENTICATE_USER_POST endpoint and await response:
            const response = await post(config.CONTENT_POST_COMMENT_POST, {
                Id: id,
                Data: {
                    UserId: userId,
                    ContentBody: newComment
                }
            });
            // If Request was successful:
            if (response.success) {
                setNewComment('');
                setComments(response.data);
            }
        }
    };

    // Methods for liking, unliking, disliking, and undisliking posts:
    const likePost = async () => {
        await post(config.CONTENT_LIKE_POST_POST, {
            Id: userId,
            Data: id
        });
        setHasLiked(true);
    };
    const unlikePost = async () => {
        await post(config.CONTENT_UNLIKE_POST_POST, {
            Id: userId,
            Data: id
        });
        setHasLiked(false);
    };
    const dislikePost = async () => {
        await post(config.CONTENT_DISLIKE_POST_POST, {
            Id: userId,
            Data: id
        });
        setHasDisliked(true);
    };
    const undislikePost = async () => {
        await post(config.CONTENT_UNDISLIKE_POST_POST, {
            Id: userId,
            Data: id
        });
        setHasDisliked(false);
    };
    const keyPressed = (e) => {
        if (e.key === 'Enter') {
            postComment();
        }
    };
    // Return our markup:
    return (
        <Box className={classes.box}>
            <Grid className={classes.grid} container spacing={3}>
                <Grid item xs={8} className={`${classes.contentGrid} ${classes.spaceGrid}`}>
                    <Card className={classes.card}>
                        <Link
                            className={classes.link}
                            component={RouterLink}
                            to={`/user/${postedContent.userId}`}>
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
                        </Link>
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
                            <IconButton color={hasLiked ? "primary" : ""} className={hasLiked ? "" : classes.iconButtons} onClick={hasLiked ? unlikePost : likePost}>
                                <ThumbUpAltIcon />
                                <div className={classes.stats}>
                                    {likes.includes(id) ?
                                        (hasLiked ? postedContent.likes : (postedContent.likes - 1)) :
                                        (hasLiked ? (postedContent.likes + 1) : postedContent.likes)}
                                </div>
                            </IconButton>
                            <IconButton color={hasDisliked ? "primary" : ""} className={hasDisliked ? "" : classes.iconButtons} onClick={hasDisliked ? undislikePost : dislikePost}>
                                <ThumbDownAltIcon />
                                <div className={classes.stats}>
                                    {dislikes.includes(id) ?
                                        (hasDisliked ? postedContent.dislikes : (postedContent.dislikes - 1)) :
                                        (hasDisliked ? (postedContent.dislikes + 1) : postedContent.dislikes)}
                                </div>
                            </IconButton>
                        </CardActions>
                        <CardContent className={classes.mobileOnly}>
                            {comments && comments.length > 0 ? comments.map(comment =>
                                <Card key={comment.id} className={classes.commentCard}>
                                    <Link
                                        className={classes.link}
                                        component={RouterLink}
                                        to={`/user/${comment.userId}`}>
                                        <CardHeader
                                            avatar={
                                                <LazyLoad>
                                                    <Avatar className={classes.commentAvatar} src={comment.userProfilePicUri} />
                                                </LazyLoad>
                                            }
                                            title={comment.userName + ' - ' + formatDate(comment.datePostedUTC)}
                                            subheader={comment.contentBody}
                                            className={classes.contentText}
                                        />
                                    </Link>
                                </Card>
                            ) : (
                                    <div className={classes.text}>No comments yet...</div>
                                )}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={4} className={`${classes.profileGrid} ${classes.spaceGrid}`}>
                    <Card className={classes.rightCard}>
                        <CardContent className={classes.commentContent}>
                            {comments && comments.length > 0 ? comments.map(comment =>
                                <Card key={comment.id} className={classes.commentCard}>
                                    <Link
                                        className={classes.link}
                                        component={RouterLink}
                                        to={`/user/${comment.userId}`}>
                                        <CardHeader
                                            avatar={
                                                <Avatar className={classes.commentAvatar} src={comment.userProfilePicUri} />
                                            }
                                            title={comment.userName + ' - ' + formatDate(comment.datePostedUTC)}
                                            subheader={comment.contentBody}
                                            className={classes.contentText}
                                        />
                                    </Link>
                                </Card>
                            ) : (
                                    <div className={classes.text}>No comments yet...</div>
                                )}
                        </CardContent>
                        <Box className={classes.commentContainer}>
                            <TextField
                                multiline
                                rowsMax="8"
                                className={classes.commentInput}
                                value={newComment}
                                onChange={handleNewCommentChange}
                                onKeyPress={keyPressed}
                                label="Post a Comment :)"
                                variant="outlined"
                            />
                            <IconButton
                                className={classes.uploadButton}
                                onClick={postComment}>
                                <SendIcon />
                            </IconButton>
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
