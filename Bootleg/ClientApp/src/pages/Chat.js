import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import config from '../config.json';
import useAuth from "../hooks/useAuth";
import LazyLoad from 'react-lazyload';
import { formatDateWithTime } from "../helpers/dateHelper";
import { useParams } from "react-router-dom";
import useRequest from '../hooks/useRequest';
import SendIcon from '@material-ui/icons/Send';
import { FilePicker } from "react-file-picker";
import Axios from "axios";
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import { HubConnectionBuilder } from '@aspnet/signalr';
import {
    Box,
    IconButton,
    CardHeader,
    Card,
    CardMedia,
    Avatar,
    Grid,
    TextField,
} from '@material-ui/core';

// Trevor Moore
// CST-451
// 2/9/2020
// This is my own work.

// Create CSS Styles:
const useStyles = makeStyles(theme => ({
    leftCard: {
        width: "80%",
        marginBottom: theme.spacing(2),
        float: "left",
    },
    rightCard: {
        width: "80%",
        marginBottom: theme.spacing(2),
        float: "right",
        backgroundColor: theme.general.medium
    },
    rightText: {
        color: theme.background
    },
    leftText: {
        color: theme.text
    },
    avatar: {
        backgroundColor: "rgb(147,112,219)"
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
    stickToBottom: {
        display: 'flex',
        width: '100%',
        position: 'fixed',
        bottom: 0,
        color: theme.button.text,
        backgroundColor: theme.general.dark
    },
    iconButtons: {
        color: "#A9A9A9"
    },
    box: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '80vh',
        overflow: 'scroll'
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
        backgroundColor: theme.general.medium,
        color: "rgb(255,255,255)",
        "&:hover": {
            backgroundColor: "rgb(113,80,181)"
        }
    },
    postInput: {
        width: "100%",
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
    text: {
        color: theme.text
    },
    video: {
        outline: "none",
        width: "100%"
    },
    img: {
        width: "100%"
    },
}));

// Chat component for rendering chats:
export default function Chat() {
    // Create our styles and set our initial state:
    const classes = useStyles();
    const [messages, setMessages] = useState([]);
    const [signalRConnection, setSignalRConnection] = useState({});
    const { id } = useParams();
    const { authState, connection, getConnection } = useAuth();
    const { get } = useRequest();
    const conn = getConnection();
    const [messageBody, setMessageBody] = useState("");
    const [file, setFile] = useState({});
    const messagesEndRef = useRef(null);
    const messagesRef = React.useRef(messages);
    const setMessageState = data => {
        messagesRef.current = data;
        setMessages(data);
    };

    // Our state change handler:
    const handleMessageBodyChange = e => {
        setMessageBody(e.target.value);
    };
    const handleFileChange = file => {
        setFile(file);
    };
    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView();
    }

    // Method for sending a new message:
    const sendMessage = async () => {
        // Create form data object and append data:
        let formData = new FormData();
        if (file) {
            formData.append('file', file);
        }
        formData.append('conversationId', id);
        formData.append('userId', authState.user.id);
        formData.append('messageBody', messageBody);
        // Send post request to send the message:
        let response = await Axios.post(
            config.MESSAGING_SEND_MESSAGE_POST,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: "Bearer " + authState.token
                }
            });
        // Upon success set the new data, and invoke the SignalR Hub for real-time delivery:
        if (response.data.success) {
            signalRConnection.invoke(config.SIGNALR_CONVERSATION_HUB_SEND_MESSAGE, {
                Id: id,
                Data: response.data.data
            });
            setMessageBody("");
        }
    };

    // useEffect hook for getting the conversation and setting up the SignalR connection:
    useEffect(() => {
        async function getConversation() {
            // If the connection isn't null:
            if (conn) {
                conn.onclose(() => {
                    alert('Please refresh the page :)');
                    console.log('Connection with SignalR has closed.');
                });
                // Set the on event so that data will update on invocation:
                conn.on(config.SIGNALR_CONVERSATION_HUB_SEND_MESSAGE, (response) => {
                    messagesRef.current.push(response);
                    setMessageState(messagesRef.current);
                    scrollToBottom();
                });
                setSignalRConnection(conn);
            }
            else {
                // Build the SignalR connection and start it:
                const hubConnection = new HubConnectionBuilder()
                    .withUrl(config.SIGNALR_CONVERSATION_HUB)
                    .build();
                await hubConnection.start()
                    .catch((error) => console.log('Error while starting connection :(  Error:' + error));
                console.log('Connected to SignalR!');
                hubConnection.onclose(() => {
                    alert('Please refresh the page :)');
                    console.log('Connection with SignalR has closed.');
                });
                // Set the on event so that data will update on invocation:
                hubConnection.on(config.SIGNALR_CONVERSATION_HUB_SEND_MESSAGE, (response) => {
                    messagesRef.current.push(response);
                    setMessageState(messagesRef.current);
                    scrollToBottom();
                });
                // Store the SignalR connection in the state:
                setSignalRConnection(hubConnection);
                // Dispatch the connection into the store:
                connection(hubConnection);
            }

            // Get the conversation:
            const response = await get(config.MESSAGING_GET_CONVERSATION_GET, {
                conversationId: id
            });
            // On success set the data:
            if (response.success) {
                setMessageState(response.data.messages);
            }
            scrollToBottom();
        }
        getConversation();
        return () => { };
    }, []);

    // Return our markup:
    return (
        <>
            <Box className={classes.box}>
                <Grid className={classes.grid} container spacing={3}>
                    <Grid id='message-box' item xs={12} className={`${classes.contentGrid} ${classes.spaceGrid}`}>
                        {messages && messages.length > 0 ? messages.map(message =>
                            <Card key={message.id} className={authState.user.id === message.userId ? classes.rightCard : classes.leftCard}>
                                <CardHeader
                                    avatar={
                                        <LazyLoad>
                                            <Avatar className={classes.avatar} src={message.profilePicUri} />
                                        </LazyLoad>
                                    }
                                    title={message.username + ' - ' + formatDateWithTime(message.datePostedUTC)}
                                    subheader={message.messageBody}
                                />
                                {message.mediaUri ? (
                                    <CardMedia>
                                        {message.mediaType == 0 ? (
                                            <LazyLoad>
                                                <img src={message.mediaUri} alt="Image couldn't load or was deleted :(" className={classes.img} />
                                            </LazyLoad>
                                        ) : (
                                                <LazyLoad>
                                                    <video className={classes.video} loop controls autoPlay>
                                                        <source src={message.mediaUri} type="video/mp4" />
                                                        <source src={message.mediaUri} type="video/webm" />
                                                        <source src={message.mediaUri} type="video/ogg" />
                                                        <p className={classes.text}>Your browser does not support our videos :(</p>
                                                    </video>
                                                </LazyLoad>
                                            )}
                                    </CardMedia>) : (
                                        <></>
                                    )}
                            </Card>
                        ) :
                            <></>}
                        <div ref={messagesEndRef} />
                    </Grid>
                </Grid>
            </Box>
            <Box className={classes.inputBox}>
                <Grid className={classes.grid} container spacing={3}>
                    <Grid item xs={12} className={classes.innerGrid}>
                        <TextField
                            className={classes.postInput}
                            autoFocus
                            multiline
                            value={messageBody}
                            onChange={handleMessageBodyChange}
                            rowsMax="8"
                            label="Send a nice message :)"
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
                            onClick={sendMessage}>
                            <SendIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}
