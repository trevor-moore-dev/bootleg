import React, { useState, useEffect } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import config from '../config.json';
import useAuth from "../hooks/useAuth";
import LazyLoad from 'react-lazyload';
import { formatDate } from "../helpers/dateHelper";
import { useParams } from "react-router-dom";
import AddIcon from '@material-ui/icons/Add';
import Axios from "axios";
import { HubConnectionBuilder, HubConnection } from '@aspnet/signalr';
import {
    Box,
    IconButton,
    CardHeader,
    Card,
    Avatar,
    Snackbar,
    Grid,
    TextField,
    SnackbarContent,
} from '@material-ui/core';

// Trevor Moore
// CST-451
// 12/9/2019
// This is my own work.

const useStyles = makeStyles(theme => ({
    card: {
        width: "auto",
        marginBottom: theme.spacing(4)
    },
    avatar: {
        backgroundColor: "rgb(147,112,219)"
    },
    text: {
        color: theme.text
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
    inputBox: {
        alignItems: "center",
        display: "flex"
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
    snackbar: {
        [theme.breakpoints.up('md')]: {
            width: '50%'
        }
    },
    snackbarContent: {
        color: theme.text,
        backgroundColor: theme.palette.secondary.main,
        width: '100%',
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
        marginLeft: "15px"
    },
}));

// Home component for rendering the home page:
export default function Messages() {
    const classes = useStyles();
    const [messages, setMessages] = useState({});
    const [connection, setConnection] = useState({});
    const { id } = useParams();
    const { authState } = useAuth();
    const [messageBody, setMessageBody] = useState("");

    const handleMessageBodyChange = e => {
        setMessageBody(e.target.value);
    };

    const sendMessage = async () => {
        let formData = new FormData();
        formData.append('conversationId', id);
        formData.append('userId', authState.user.id);
        formData.append('messageBody', messageBody);
        let response = await Axios.post(
            config.MESSAGING_SEND_MESSAGE_POST,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: "Bearer " + authState.token
                }
            });
        if (response.data.success) {
            connection.invoke(config.SIGNALR_CONVERSATION_HUB_INVOKE_GET_CONVERSATION, id);
        }
    };

    useEffect(() => {
        async function getConversations() {
            const hubConnection = new HubConnectionBuilder()
                .withUrl(config.SIGNALR_CONVERSATION_HUB)
                .build();
            await hubConnection.start()
                .catch((error) => console.log('Error while starting connection :(  Error:' + error));
            console.log('Connected to SignalR!');
            hubConnection.onclose(() => {
                console.log('Connection with SignalR has closed.');
            });

            /**const hubConnection = new HubConnection(config.SIGNALR_CONVERSATION_HUB)
                .start()
                .then(() => console.log('Connected to SignalR Hub!'))
                .catch((error) => console.log('Error while establishing connection :(  Error:' + error));**/

            hubConnection.on(config.SIGNALR_CONVERSATION_HUB_ON_GET_CHAT, (response) => {
                console.log(response.data.messages);
                setMessages(response.data.messages)
            });
            hubConnection.invoke(config.SIGNALR_CONVERSATION_HUB_INVOKE_GET_CONVERSATION, id)
                .catch((error) => console.log('Error while invoking connection :(  Error:' + error));

            setConnection(hubConnection);
        }
        getConversations();
        return () => {
            connection.invoke(config.SIGNALR_CONVERSATION_HUB_LEAVE_CONVERSATION, id)
                .stop()
                .catch((error) => console.log('Error while stopping connection :(  Error:' + error));
            console.log('SignalR Hub connection successully closed :)');
        };
    }, []);

    return (
        <>
            <Box className={classes.box}>
                <Grid className={classes.grid} container spacing={3}>
                    <Grid item xs={12} className={`${classes.contentGrid} ${classes.spaceGrid}`}>
                        {messages && messages.length > 0 ? messages.map(message =>
                            <Card key={message.id} className={classes.card}>
                                <CardHeader
                                    avatar={
                                        <LazyLoad>
                                            <Avatar className={classes.avatar} src={message.profilePicUri} />
                                        </LazyLoad>
                                    }
                                    subheader={message.messageBody}
                                    title={message.datePostedUTC}
                                    className={classes.text}
                                />
                            </Card>
                        ) :
                            <></>}
                    </Grid>
                </Grid>
            </Box>
            <Snackbar open={true} className={classes.snackbar}>
                <SnackbarContent
                    className={classes.snackbarContent}
                    message={
                        <>
                            <Box className={classes.inputBox}>
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
                                    <AddIcon />
                                </IconButton>
                            </Box>
                        </>}
                />
            </Snackbar>
        </>
    );
}
