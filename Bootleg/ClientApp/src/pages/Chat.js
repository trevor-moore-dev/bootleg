import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import config from '../config.json';
import useAuth from "../hooks/useAuth";
import LazyLoad from 'react-lazyload';
import { formatDateWithTime, currentTicks } from "../helpers/dateHelper";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router";
import useRequest from '../hooks/useRequest';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import SendIcon from '@material-ui/icons/Send';
import { FilePicker } from "react-file-picker";
import Axios from "axios";
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import ScrollToBottom from 'react-scroll-to-bottom';
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
    iconButtons: {
        color: "#A9A9A9"
    },
    box: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'scroll',
    },
    inputBox: {
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        marginTop: theme.spacing(2)
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
        paddingBottom: "96px!important",
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
    hidden: {
        display: "none"
    },
}));

// Chat component for rendering chats:
export default function Chat() {
    // Create our styles and set our initial state:
    const classes = useStyles();
    const { id } = useParams();
    const [update, setUpdate] = useState(currentTicks());
    const { getUserId, getToken, getConnection, storeConnection, resetConnection } = useAuth();
    const userToken = getToken();
    const userId = getUserId();
    const { get } = useRequest();
    const connection = getConnection();
    const [messageBody, setMessageBody] = useState("");
    const [file, setFile] = useState({});
    const messagesRef = useRef(null);

    // Our state change handlers:
    const establishConnection = conn => {
        conn.onclose(() => {
            resetConnection();
            alert('Please refresh the page :)');
            console.log('Connection with SignalR has closed.');
        });
        // Set the on event so that data will update on invocation:
        conn.on(config.SIGNALR_CONVERSATION_HUB_SEND_MESSAGE, (response) => {
            messagesRef.current.push(response);
            setUpdate(currentTicks());
            setMessageBody("");
            setFile(null);
        });
        // Invoke joining the current conversation:
        conn.invoke(config.SIGNALR_CONVERSATION_HUB_JOIN_CONVERSATION, id);
        // Dispatch the connection into the store:
        storeConnection(conn);
    };

    // useEffect hook for getting the conversation and setting up the SignalR connection:
    useEffect(() => {
        async function getConversation() {
            // Get the conversation:
            const response = await get(config.MESSAGING_GET_CONVERSATION_GET, {
                conversationId: id
            });
            // On success set the data:
            if (response.success) {
                messagesRef.current = response.data.messages;
            }
            // If the connection isn't null:
            if (connection) {
                establishConnection(connection);
            }
            else {
                // Build the SignalR connection and start it:
                const conn = new HubConnectionBuilder()
                    .withUrl(config.SIGNALR_CONVERSATION_HUB)
                    .build();
                // Start the SignalR connection and start it:
                await conn.start()
                    .catch((error) => console.log('Error while starting connection :(  Error:' + error));
                console.log('Connected to SignalR!');
                establishConnection(conn);
            }
            //scrollToBottom();
        }
        getConversation();
        return () => { };
    }, []);

    // Return our markup:
    return (
        <>
            <div className={classes.hidden}>{update}</div>
            <ScrollToBottom checkInterval={150} mode="bottom">
                <Box className={classes.box}>
                    <Grid className={classes.grid} container spacing={3}>
                        <Grid id='message-box' item xs={12} className={`${classes.contentGrid} ${classes.spaceGrid}`}>
                            {messagesRef.current && messagesRef.current.length > 0 ? messagesRef.current.map(message =>
                                <Card key={message.id} className={userId === message.userId ? classes.rightCard : classes.leftCard}>
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
                        </Grid>
                    </Grid>
                </Box>
            </ScrollToBottom>
        </>
    );
}
