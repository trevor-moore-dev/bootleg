import React, { useState, useEffect } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import config from '../config.json';
import useAuth from "../hooks/useAuth";
import LazyLoad from 'react-lazyload';
import { formatDateWithTime } from "../helpers/dateHelper";
import { useParams } from "react-router-dom";
import SendIcon from '@material-ui/icons/Send';
import Axios from "axios";
import { HubConnectionBuilder } from '@aspnet/signalr';
import {
    Box,
    IconButton,
    CardHeader,
    Card,
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
}));

// Chat component for rendering chats:
export default function Chat() {
    // Create our styles and set our initial state:
    const classes = useStyles();
    const [messages, setMessages] = useState({});
    const [connection, setConnection] = useState({});
    const { id } = useParams();
    const { authState } = useAuth();
    const [messageBody, setMessageBody] = useState("");

    // On change handler:
    const handleMessageBodyChange = e => {
        setMessageBody(e.target.value);
    };

    // Method for sending a new message:
    const sendMessage = async () => {
        // Create form data object and append data:
        let formData = new FormData();
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
            connection.invoke(config.SIGNALR_CONVERSATION_HUB_INVOKE_GET_CONVERSATION, id);
            setMessageBody("");
            let messageContainer = document.getElementById("message-box");
            messageContainer.scrollTop = messageContainer.scrollHeight;
        }
    };

    // useEffect hook for getting the conversation and setting up the SignalR connection:
    useEffect(() => {
        async function getConversation() {
            // Build the SignalR connection and start it:
            const hubConnection = new HubConnectionBuilder()
                .withUrl(config.SIGNALR_CONVERSATION_HUB)
                .build();
            await hubConnection.start()
                .catch((error) => console.log('Error while starting connection :(  Error:' + error));
            console.log('Connected to SignalR!');
            hubConnection.onclose(() => {
                console.log('Connection with SignalR has closed.');
            });
            // Set the on event so that data will update on invocation:
            hubConnection.on(config.SIGNALR_CONVERSATION_HUB_ON_GET_CHAT, (response) => {
                setMessages(response.data.messages)
            });
            // Set invoke event so that data will initially be delivered:
            hubConnection.invoke(config.SIGNALR_CONVERSATION_HUB_INVOKE_GET_CONVERSATION, id)
                .catch((error) => console.log('Error while invoking connection :(  Error:' + error));
            // Set data and scroll to bottom of the scroll:
            let messageContainer = document.getElementById("message-box");
            messageContainer.scrollTop = messageContainer.scrollHeight;
            setConnection(hubConnection);
        }
        getConversation();
        return () => { };
    }, []);

    // Return our markup:
    return (
        <>
            <Box className={classes.box} id='message-box'>
                <Grid className={classes.grid} container spacing={3}>
                    <Grid item xs={12} className={`${classes.contentGrid} ${classes.spaceGrid}`}>
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
                            </Card>
                        ) :
                            <></>}
                    </Grid>
                </Grid>
            </Box>
            <Box className={classes.inputBox}>
                <Grid className={classes.grid} container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            className={classes.postInput}
                            autoFocus
                            multiline
                            value={messageBody}
                            onChange={handleMessageBodyChange}
                            rowsMax="8"
                            label="Write some snazzy message..."
                            variant="outlined"
                        />
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
