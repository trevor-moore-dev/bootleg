import React, { useState } from "react";
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import MailIcon from '@material-ui/icons/Mail';
import HomeIcon from '@material-ui/icons/Home';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SearchIcon from '@material-ui/icons/Search';
import ExploreIcon from '@material-ui/icons/Explore';
import { makeStyles } from "@material-ui/core/styles";
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import Axios from "axios";
import config from '../config.json';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import AddIcon from '@material-ui/icons/Add';
import { FilePicker } from "react-file-picker";
import useAuth from "../hooks/useAuth";
import { Link as RouterLink } from 'react-router-dom';
import {
    Fab,
    IconButton,
    Snackbar,
    SnackbarContent,
    Box,
    TextField,
    Tooltip
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
    }
}));

// Nav Bar component for the top of the web app:
export default function Footer() {
    // Create our styles and declare our state properties:
    const classes = useStyles();
    const [contentBody, setContentBody] = useState("");
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState({});
    const { authState } = useAuth();
    const [value, setValue] = React.useState('recents');

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
    };

    const uploadPost = async () => {
        let formData = new FormData();
        if (file) {
            formData.append('file', file);
        }
        formData.append('contentBody', contentBody);
        formData.append('userId', authState.user.id);
        let response = await Axios.post(
            config.CONTENT_UPLOAD_CONTENT_POST,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: "Bearer " + authState.token
                }
            });
    };

    // Render our nav bar:
    return (
        <>
            <BottomNavigation value={value} onChange={handleChange} className={classes.stickToBottom}>
                <BottomNavigationAction component={RouterLink} to="/" icon={<HomeIcon className={classes.footerIcon} />} />
                <BottomNavigationAction component={RouterLink} to="/explore" icon={<ExploreIcon className={classes.footerIcon} />} />
                <BottomNavigationAction onClick={handleOpen} icon={<AddCircleOutlineIcon className={classes.footerIcon} />} />
                <BottomNavigationAction component={RouterLink} to="/messages" icon={<MailIcon className={classes.footerIcon} />} />
                <BottomNavigationAction component={RouterLink} to="/my-account" icon={<AccountCircleIcon className={classes.footerIcon} />} />
            </BottomNavigation>
            <Tooltip title="Create New Post" className={classes.sectionDesktop}>
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
                                    label="Write some stuff..."
                                    variant="outlined"
                                />
                                <FilePicker
                                    extensions={["jpeg", "mov", "mp4", "jpg", "img", "png", "wmv", "avi"]}
                                    onChange={handleFileChange}
                                    className={classes.fileUpload}
                                >
                                    <IconButton color="inherit" className={classes.filePickerButton}>
                                        <AddPhotoAlternateIcon />
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
                        <IconButton className={classes.closeButton} onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>}
                />
            </Snackbar>
        </>
    );
}