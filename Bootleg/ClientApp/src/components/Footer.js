import React, { useState } from "react";
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import MailIcon from '@material-ui/icons/Mail';
import HomeIcon from '@material-ui/icons/Home';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExploreIcon from '@material-ui/icons/Explore';
import { useLocation } from "react-router";
import { makeStyles } from "@material-ui/core/styles";
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import Axios from "axios";
import config from '../config.json';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import AddIcon from '@material-ui/icons/Add';
import { FilePicker } from "react-file-picker";
import useAuth from "../hooks/useAuth";
import { Link as RouterLink, useParams } from 'react-router-dom';
import {
    Fab,
    IconButton,
    Snackbar,
    SnackbarContent,
    Badge,
    Box,
    TextField,
    Tooltip,
    Grid
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
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
        width: '100%',
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
            mouse: "pointer"
        },
    },
    filePickerButton: {
        marginLeft: "10px",
        marginRight: "10px"
    },
    postInput: {
        width: "100%",
        marginLeft: "15px"
    },
    uploadButton: {
        backgroundColor: theme.general.medium,
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
}));

// Footer component for the bottom of the web app:
export default function Footer() {
    // Create our styles and declare our state properties:
    const classes = useStyles();
    const [contentBody, setContentBody] = useState("");
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState(null);
    const { getUserId, getToken, getConnection } = useAuth();
    const userToken = getToken();
    const userId = getUserId();
    const { id } = useParams();
    const connection = getConnection();
    const [value, setValue] = React.useState('recents');
    const location = useLocation();

    // Our state change handlers:
    const handleFileChange = file => {
        setFile(file);
    };
    const handleContentBodyChange = e => {
        setContentBody(e.target.value);
    };
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setContentBody("");
        setFile(null);
    };

    // Method for sending a new message:
    const sendMessage = async () => {
        // Create form data object and append data:
        let formData = new FormData();
        if (file) {
            formData.append('file', file);
        }
        formData.append('conversationId', id);
        formData.append('userId', userId);
        formData.append('messageBody', contentBody);
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
                Id: id,
                Data: response.data.data
            });
            handleClose();
        }
    };

    // Method for uploading a post:
    const uploadPost = async () => {
        // Create new FormData object to hold files:
        let formData = new FormData();
        // Append file if it's there:
        if (file) {
            formData.append('file', file);
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
            handleClose();
        }
    };

    // Return our footer:
    return (
        <>

            <BottomNavigation value={value} onChange={handleChange} className={classes.stickToBottom}>
                <BottomNavigationAction component={RouterLink} to="/" icon={<HomeIcon className={classes.footerIcon} />} />
                <BottomNavigationAction component={RouterLink} to="/explore" icon={<ExploreIcon className={classes.footerIcon} />} />
                <BottomNavigationAction onClick={handleOpen} icon={<AddCircleOutlineIcon className={classes.footerIcon} />} />
                <BottomNavigationAction component={RouterLink} to="/messages" icon={<MailIcon className={classes.footerIcon} />} />
                <BottomNavigationAction component={RouterLink} to="/my-account" icon={<AccountCircleIcon className={classes.footerIcon} />} />
            </BottomNavigation>
            <Tooltip title={location.pathname.includes("/chat") ? "Create a New Post" : "Send a Message"} className={classes.sectionDesktop}>
                <Fab className={classes.fab} onClick={handleOpen}>
                    <EditIcon />
                </Fab>
            </Tooltip>
            <Snackbar open={open} className={classes.snackbar}>
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
                                    label={location.pathname.includes("/chat") ? "Create a New Post :)" : "Send a Message :)"}
                                    variant="outlined"
                                />
                                <FilePicker
                                    extensions={["jpeg", "mov", "mp4", "jpg", "img", "png", "wmv", "avi"]}
                                    onChange={handleFileChange}
                                    className={classes.fileUpload}
                                >
                                    <IconButton color="inherit" className={classes.filePickerButton}>
                                        {file && file.length > 0 ?
                                            <Badge badgeContent={1} color='secondary'>
                                                <AddPhotoAlternateIcon />
                                            </Badge> : <AddPhotoAlternateIcon />}
                                    </IconButton>
                                </FilePicker>
                                <IconButton
                                    className={classes.uploadButton}
                                    onClick={location.pathname.includes("/chat") ? sendMessage : uploadPost}>
                                    <AddIcon />
                                </IconButton>
                            </Box>
                        </>}
                    action={
                        <IconButton className={classes.closeButton} onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>}
                />
            </Snackbar>
        </>
    );
}