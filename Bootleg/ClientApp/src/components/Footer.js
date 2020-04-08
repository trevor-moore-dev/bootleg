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
import CloseIcon from '@material-ui/icons/Close';
import Axios from "axios";
import config from '../config.json';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import AddIcon from '@material-ui/icons/Add';
import { FilePicker } from "react-file-picker";
import useRequest from '../hooks/useRequest';
import useAuth from "../hooks/useAuth";
import { Link as RouterLink } from 'react-router-dom';
import {
    Fab,
    IconButton,
    Snackbar,
    Link,
    SnackbarContent,
    Badge,
    Box,
    Avatar,
    TextField,
    Tooltip,
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
        marginLeft: "10px",
        marginRight: "10px"
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
    avatar: {
        height: '24px',
        width: '24px'
    }
}));

// Footer component for the bottom of the web app:
export default function Footer() {
    // Create our styles and declare our state properties:
    const classes = useStyles();
    const [contentBody, setContentBody] = useState("");
    const [contentFile, setContentFile] = useState(null);
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

    // Our state change handlers:
    const handleContentFileChange = file => {
        setContentFile(file);
    };
    const handleContentBodyChange = e => {
        setContentBody(e.target.value);
    };
    const handleMessageFileChange = file => {
        setMessageFile(file);
    };
    const handleMessageBodyChange = e => {
        setMessageBody(e.target.value);
    };
    const handleCommentBodyChange = e => {
        setCommentBody(e.target.value);
    };
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const handleContentClose = () => {
        setContentBody("");
        setContentFile(null);
    };
    const handleMessageClose = () => {
        setMessageBody("");
        setMessageFile(null);
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
            }
        }
    };

    // Method for uploading a post:
    const uploadPost = async () => {
        // Create new FormData object to hold files:
        let formData = new FormData();
        // Append file if it's there:
        if (contentFile) {
            formData.append('file', contentFile);
        }
        // Append contentBody and userId:
        formData.append('contentBody', contentBody);
        formData.append('userId', userId);
        // Send post request:
        let response = await Axios.post(
            config.CONTENT_UPLOAD_CONTENT_POST,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: "Bearer " + userToken
                }
            });
        if (response.data.success) {
            handleContentClose();
        }
    };

    // Return our footer:
    return (
        <>
            <BottomNavigation value={value} onChange={handleChange} className={classes.stickToBottom}>
                <div className={classes.lukeypookey}>
                    {location.pathname.toLowerCase().includes("/messages") &&
                        <div className={classes.messageInput}>
                            <Box className={classes.messageBox}>
                                <TextField
                                    className={classes.postInput}
                                    value={messageBody}
                                    onChange={handleMessageBodyChange}
                                    label="Send a Message :)"
                                    variant="outlined"
                                />
                                <FilePicker
                                    extensions={["jpeg", "mov", "mp4", "jpg", "img", "png", "wmv", "avi"]}
                                    onChange={handleMessageFileChange}
                                    className={classes.fileUpload}
                                >
                                    <IconButton color="inherit" className={classes.filePickerButton}>
                                        {messageFile && messageFile.length > 0 ?
                                            <Badge badgeContent={1} color='secondary'>
                                                <AddPhotoAlternateIcon />
                                            </Badge> : <AddPhotoAlternateIcon />}
                                    </IconButton>
                                </FilePicker>
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
                        <BottomNavigationAction component={RouterLink} to="/new-post" icon={<AddCircleOutlineIcon className={classes.footerIcon} />} />
                        <BottomNavigationAction component={RouterLink} to="/messages" icon={<MailIcon className={classes.footerIcon} />} />
                        <BottomNavigationAction component={RouterLink} to="/my-account" icon={<Avatar className={classes.avatar} src={authState.user.profilePic} />} />
                    </div>
                </div>
            </BottomNavigation>
            <Link
                className={classes.sectionDesktop}
                component={RouterLink}
                to="/new-post">
                <Fab className={classes.fab}>
                    <EditIcon />
                </Fab>
            </Link>
            <Snackbar open={false} className={classes.snackbar}>
                <SnackbarContent
                    className={classes.snackbarContent}
                    message={
                        <>
                            <Box className={classes.box}>
                                <TextField
                                    className={classes.postInput}
                                    autoFocus
                                    multiline
                                    value={contentBody}
                                    onChange={handleContentBodyChange}
                                    rowsMax="8"
                                    label="Create a New Post :)"
                                    variant="outlined"
                                />
                                <FilePicker
                                    extensions={["jpeg", "mov", "mp4", "jpg", "img", "png", "wmv", "avi"]}
                                    onChange={handleContentFileChange}
                                    className={classes.fileUpload}
                                >
                                    <IconButton color="inherit" className={classes.filePickerButton}>
                                        {contentFile && contentFile.length > 0 ?
                                            <Badge badgeContent={1} color='secondary'>
                                                <AddPhotoAlternateIcon />
                                            </Badge> : <AddPhotoAlternateIcon />}
                                    </IconButton>
                                </FilePicker>
                                <IconButton
                                    className={classes.uploadButton}
                                    onClick={uploadPost}>
                                    <AddIcon />
                                </IconButton>
                            </Box>
                        </>}
                    action={
                        <IconButton className={classes.closeButton} onClick={handleContentClose}>
                            <CloseIcon />
                        </IconButton>}
                />
            </Snackbar>
        </>
    );
}