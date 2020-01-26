import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import Axios from "axios";
import config from '../config.json';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import AddIcon from '@material-ui/icons/Add';
import { FilePicker } from "react-file-picker";
import useAuth from "../hooks/useAuth";
import {
    Fab,
    IconButton,
    Snackbar,
    SnackbarContent,
    Box,
    TextField
} from '@material-ui/core';

// Trevor Moore
// CST-451
// 12/9/2019
// This is my own work.

// Create CSS styles:
const useStyles = makeStyles(theme => ({
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
    }
}));

// Template component for rendering the template of our web app, and where main components get rendered within it:
export default function ContentUpload() {
    // Create our styles and declare our state properties with the useState Hooks API:
    const classes = useStyles();
    const [contentBody, setContentBody] = useState("");
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState({});
    const { authState } = useAuth();

    const handleFileChange = file => {
        setFile(file);
    };

    const handleContentBodyChange = e => {
        setContentBody(e.target.value);
    };

    // Function for handling when the user submits the register form:
    const uploadPost = async () => {
        let formData = new FormData();
        if (file) {
            formData.append('file', file);
        }
        formData.append('contentBody', contentBody);
        formData.append('token', authState.token);
        let response = await Axios.post(
            config.CONTENT_UPLOAD_CONTENT_POST,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: "Bearer " + authState.token
                }
            });
        if (response.success) {
            alert('success :)');
        }
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // Render our markup:
    return (
        <>
            <Fab className={classes.fab} onClick={handleOpen}>
                <EditIcon />
            </Fab>
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