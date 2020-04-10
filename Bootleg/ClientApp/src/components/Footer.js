import React, { useState } from "react";
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import MailIcon from '@material-ui/icons/Mail';
import HomeIcon from '@material-ui/icons/Home';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import ExploreIcon from '@material-ui/icons/Explore';
import { useLocation } from "react-router";
import { makeStyles } from "@material-ui/core/styles";
import EditIcon from '@material-ui/icons/Edit';
import SendIcon from '@material-ui/icons/Send';
import Axios from "axios";
import config from '../config.json';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import { FilePicker } from "react-file-picker";
import useRequest from '../hooks/useRequest';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import useAuth from "../hooks/useAuth";
import LazyLoad from 'react-lazyload';
import { Link as RouterLink, Redirect } from 'react-router-dom';
import {
    Fab,
    IconButton,
    Link,
    Badge,
    Box,
    Avatar,
    TextField,
} from '@material-ui/core';

// Trevor Moore
// CST-451
// 12/9/2019
// This is my own work.

// Create CSS styles:
const useStyles = makeStyles(theme => ({
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
    stickToBottom: {
        display: 'flex',
        width: '100%',
        height: 'auto',
        position: 'fixed',
        bottom: 0,
        color: theme.button.text,
        backgroundColor: theme.general.dark
    },
    box: {
        alignItems: "center",
        display: "flex"
    },
    fab: {
        margin: theme.spacing(1),
        position: "fixed",
        bottom: theme.spacing(2),
        right: theme.spacing(3),
        color: theme.button.text,
        backgroundColor: theme.button.background,
        "&:hover": {
            backgroundColor: theme.button.hover
        }
    },
    snackbarContent: {
        color: theme.text,
        backgroundColor: theme.palette.secondary.main,
        width: '100%',
    },
    snackbar: {
        [theme.breakpoints.up('md')]: {
            width: '50%'
        }
    },
    closeButton: {
        position: 'absolute',
        left: theme.spacing(0.5),
        top: theme.spacing(0.5),
        color: theme.palette.grey[500],
        padding: 0
    },
    button: {
        color: theme.button.text,
        backgroundColor: theme.button.background,
        "&:hover": {
            backgroundColor: theme.button.hover
        }
    },
    fileUpload: {
        '&:hover': {
            cursor: "pointer"
        }
    },
    filePickerButton: {
        color: "#A9A9A9",
        marginLeft: "10px",
        marginRight: "10px",
        '&:hover': {
            cursor: "pointer"
        },
        cursor: "pointer",
    },
    postInput: {
        width: "100%"
    },
    uploadButton: {
        backgroundColor: theme.general.medium,
        color: "rgb(255,255,255)",
        "&:hover": {
            backgroundColor: "rgb(113,80,181)"
        }
    },
    commentButton: {
        backgroundColor: theme.general.medium,
        marginLeft: "5px",
        color: "rgb(255,255,255)",
        "&:hover": {
            backgroundColor: "rgb(113,80,181)"
        }
    },
    footerIcon: {
        color: "#A9A9A9"
    },
    inputBox: {
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        marginTop: theme.spacing(2),
    },
    grid: {
        [theme.breakpoints.up('md')]: {
            width: "70%"
        },
    },
    innerGrid: {
        display: "flex"
    },
    messageBox: {
        alignItems: "center",
        display: "flex",
        marginTop: "10px",
    },
    messageInput: {
        display: 'block',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        }
    },
    commentInput: {
        display: 'block',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        }
    },
    navigation: {
        display: "flex",
        marginBottom: "5px",
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    lukeypookey: {
        width: '95%'
    },
    filePreview: {
        transform: 'translateY(-103%)',
        position: 'absolute',
    },
    mediaPreview: {
        maxHeight: '40vh',
        maxWidth: '90vw',
        outline: 'none',
    },
    avatar: {
        height: '24px',
        width: '24px'
    }
}));

// Footer component for the bottom of the web app:
export default function Footer() {
    // Create our styles and declare our state properties:
    const classes = useStyles();
    const [messageBody, setMessageBody] = useState("");
    const [messageFile, setMessageFile] = useState(null);
    const [commentBody, setCommentBody] = useState("");
    const { getUserId, getToken, getId, getConnection, authState } = useAuth();
    const userToken = getToken();
    const userId = getUserId();
    const currentId = getId();
    const connection = getConnection();
    const [value, setValue] = React.useState('recents');
    const location = useLocation();
    const { post } = useRequest();
    const [media, setMedia] = useState(null);
    const [isImage, setIsImage] = useState(false);
    const [isVideo, setIsVideo] = useState(false);
    // Our state change handlers:
    const handleMessageBodyChange = e => {
        setMessageBody(e.target.value);
    };
    const handleCommentBodyChange = e => {
        setCommentBody(e.target.value);
    };
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const handleMessageFileChange = file => {
        let reader = new FileReader();
        reader.onloadend = () => {
            setMessageFile(file);
            setMedia(reader.result);
        }
        reader.readAsDataURL(file);
        let extension = file.name.split('.').pop().toLowerCase(),
            image = ["jpeg", "jpg", "img", "png"].indexOf(extension) > -1,
            video = ["mov", "mp4", "wmv", "avi"].indexOf(extension) > -1;
        setIsImage(image);
        setIsVideo(video);
    };
    const removeFile = () => {
        setMessageFile(null);
        setMedia(null);
        setIsImage(false);
        setIsVideo(false);
    };
    const handleMessageClose = () => {
        setMessageBody("");
        setMessageFile(null);
        setMedia(null);
        setIsImage(false);
        setIsVideo(false);
    };
    // Method for sending a new message:
    const sendMessage = async () => {
        // Create form data object and append data:
        let formData = new FormData();
        if (messageFile) {
            formData.append('file', messageFile);
        }
        formData.append('conversationId', currentId);
        formData.append('userId', userId);
        formData.append('messageBody', messageBody);
        // Send post request to send the message:
        let response = await Axios.post(
            config.MESSAGING_SEND_MESSAGE_POST,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: "Bearer " + userToken
                }
            });
        // Upon success set the new data, and invoke the SignalR Hub for real-time delivery:
        if (response.data.success) {
            connection.invoke(config.SIGNALR_CONVERSATION_HUB_SEND_MESSAGE, {
                Id: currentId,
                Data: response.data.data
            });
            handleMessageClose();
        }
    };
    // Method for posting a new comment:
    const postComment = async () => {
        // If commentBody is truthy, post it:
        if (commentBody) {
            // Send post request to AUTHENTICATION_AUTHENTICATE_USER_POST endpoint and await response:
            const response = await post(config.CONTENT_POST_COMMENT_POST, {
                Id: currentId,
                Data: {
                    UserId: userId,
                    ContentBody: commentBody
                }
            });
            // If Request was successful:
            if (response.success) {
                setCommentBody('');
                window.location.reload();
            }
        }
    };
    const sendMessageKeyPressed = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };
    const commentKeyPressed = (e) => {
        if (e.key === 'Enter') {
            postComment();
        }
    };
    // Return our footer:
    return (
        <>
            <BottomNavigation value={value} onChange={handleChange} className={classes.stickToBottom}>
                {media &&
                    <div className={classes.filePreview}>
                        {isImage &&
                            <LazyLoad>
                                <img src={media} className={classes.mediaPreview} />
                            </LazyLoad>}
                        {isVideo &&
                            <LazyLoad>
                                <video className={classes.mediaPreview} loop controls autoPlay>
                                    <source src={media} type="video/mp4" />
                                    <source src={media} type="video/webm" />
                                    <source src={media} type="video/ogg" />
                                    <p className={classes.text}>Your browser does not support our videos :(</p>
                                </video>
                            </LazyLoad>}
                    </div>}
                <div className={classes.lukeypookey}>
                    {location.pathname.toLowerCase().includes("/messages") &&
                        <div className={classes.messageInput}>
                            <Box className={classes.messageBox}>
                                <TextField
                                    className={classes.postInput}
                                    onKeyPress={sendMessageKeyPressed}
                                    value={messageBody}
                                    onChange={handleMessageBodyChange}
                                    label="Send a Message :)"
                                    variant="outlined"
                                />
                                {messageFile ?
                                    <IconButton
                                        className={classes.filePickerButton}
                                        onClick={removeFile}>
                                        <HighlightOffIcon />
                                    </IconButton>
                                    :
                                    <FilePicker
                                        extensions={["jpeg", "mov", "mp4", "jpg", "img", "png", "wmv", "avi"]}
                                        onChange={handleMessageFileChange}
                                        onKeyPress={sendMessageKeyPressed}
                                        className={classes.fileUpload}
                                        maxSize='999999'
                                    >
                                        <IconButton color="inherit" className={classes.filePickerButton}>
                                            <AddPhotoAlternateIcon />
                                        </IconButton>
                                    </FilePicker>}
                                <IconButton
                                    className={classes.uploadButton}
                                    onClick={sendMessage}>
                                    <SendIcon />
                                </IconButton>
                            </Box>
                        </div>}
                    {location.pathname.toLowerCase().includes("/post") &&
                        <div className={classes.commentInput}>
                            <Box className={classes.messageBox}>
                                <TextField
                                    className={classes.postInput}
                                    value={commentBody}
                                    onKeyPress={commentKeyPressed}
                                    onChange={handleCommentBodyChange}
                                    label="Post a Comment :)"
                                    variant="outlined"
                                />
                                <IconButton
                                    className={classes.commentButton}
                                    onClick={postComment}>
                                    <SendIcon />
                                </IconButton>
                            </Box>
                        </div>}
                    <div className={classes.navigation}>
                        <BottomNavigationAction component={RouterLink} to="/" icon={<HomeIcon className={classes.footerIcon} />} />
                        <BottomNavigationAction component={RouterLink} to="/explore" icon={<ExploreIcon className={classes.footerIcon} />} />
                        <BottomNavigationAction component={RouterLink} to="/create" icon={<AddCircleOutlineIcon className={classes.footerIcon} />} />
                        <BottomNavigationAction component={RouterLink} to="/messages" icon={<MailIcon className={classes.footerIcon} />} />
                        <BottomNavigationAction href={`/user/${userId}`} icon={<Avatar className={classes.avatar} src={authState.user.profilePic} />} />
                    </div>
                </div>
            </BottomNavigation>
            <Link
                className={classes.sectionDesktop}
                component={RouterLink}
                to="/create">
                <Fab className={classes.fab}>
                    <EditIcon />
                </Fab>
            </Link>
        </>
    );
}