import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import useRequest from '../hooks/useRequest';
import config from '../config.json';
import {
    Fab,
    Typography,
    IconButton,
    Snackbar,
    SnackbarContent,
    Button,
    Box,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    Switch
} from '@material-ui/core';

// Trevor Moore
// CST-451
// 12/9/2019
// This is my own work.

// Create CSS styles:
const useStyles = makeStyles(theme => ({
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
    snackbar: {
        color: theme.text,
        backgroundColor: theme.palette.secondary.main
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    }
}));

// Template component for rendering the template of our web app, and where main components get rendered within it:
export default function ContentUpload() {
    // Create our styles and declare our state properties with the useState Hooks API:
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState({});
    const { get, post } = useRequest();

    const handleFileChange = e => {
        setFile(e.target.files[0]);
    };

    // Function for handling when the user submits the register form:
    const uploadFile = async () => {
        let form = new FormData();

        form.append('file', file);

        let response = await post(config.CONTENT_UPLOAD_CONTENT_POST, form)
            .catch((ex) => {
                console.error(ex);
            });
        // If Request was successful:
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
            <Snackbar open={open}>
                <SnackbarContent
                    className={classes.snackbar}
                    message={
                        <div>
                            <Typography variant="h6">
                                New Post
                            </Typography>
                            <Box display='flex'>
                                <TextField
                                    autoFocus
                                    label="Write some stuff..."
                                    margin="normal"
                                    variant="filled"
                                />
                                <input type='file' onChange={handleFileChange} />
                                <Button
                                    variant='contained'
                                    onClick={uploadFile}
                                >
                                    Upload
                                </Button>
                            </Box>
                        </div>}
                    action={
                        <IconButton className={classes.closeButton} onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>}
                />
            </Snackbar>





            {/**<Dialog
						fullWidth={true}
						maxWidth={'md'}
						open={open}
						style={{
							zIndex: 2000,
							bottom: 0,
						}}
					>
						<DialogTitle>
							Create a post
							<IconButton className={classes.closeButton} onClick={handleClose}>
								<CloseIcon />
							</IconButton>
						</DialogTitle>
						<DialogContent>
							<DialogContentText>
								Here is where form input will be:
          					</DialogContentText>

							<form className={classes.form} noValidate>
								<FormControl className={classes.formControl}>

								</FormControl>
							</form>

						</DialogContent>
					</Dialog>**/}
        </>
    );
}