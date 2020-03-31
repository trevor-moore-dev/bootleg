import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import config from '../config.json';
import useAuth from "../hooks/useAuth";
import LazyLoad from 'react-lazyload';
import { formatDateWithTime, currentTicks } from "../helpers/dateHelper";
import { useParams } from "react-router-dom";
import useRequest from '../hooks/useRequest';
import { HubConnectionBuilder } from '@aspnet/signalr';
import FadeIn from 'react-fade-in';
import Emoji from 'react-emoji-render';
import {
    Box,
    CardHeader,
    Card,
    Avatar,
    Grid,
} from '@material-ui/core';

// Trevor Moore
// CST-451
// 2/9/2020
// This is my own work.

// Create CSS Styles:
const useStyles = makeStyles(theme => ({
    lightText: {
        color: theme.text
    },
    darkText: {
        color: "#363537"
    },
    lightHeaderText: {
        color: theme.text,
        fontWeight: "bold"
    },
    darkHeaderText: {
        color: "#363537",
        fontWeight: "bold"
    },
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
    iconButtons: {
        color: "#A9A9A9"
    },
    box: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'scroll',
    },
    center: {
        textAlign: 'center',
        color: theme.lightText
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
        paddingBottom: "144px!important",
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
    video: {
        outline: "none",
        width: "80%"
    },
    img: {
        width: "80%"
    },
    hidden: {
        display: "none"
    },
    rightAvatar: {
        float: 'right',
        margin: '5px'
    },
    leftAvatar: {
        float: 'left',
        margin: '5px'
    },
    right: {
        float: 'right'
    },
    left: {
        float: 'left'
    },
    messageContainer: {
        width: '100%',
        display: 'inline-grid'
    }
}));

// Chat component for rendering chats:
export default function Chat() {
    // Create our styles and set our initial state:
    const classes = useStyles();
    const { id } = useParams();
    const [update, setUpdate] = useState(currentTicks());
    const { getUserId, getConnection, storeId, storeConnection, resetConnection } = useAuth();
    const userId = getUserId();
    const { get } = useRequest();
    const connection = getConnection();
    const messagesRef = useRef(null);
    const bottomRef = useRef(null);

    // Our state change handlers:
    const scrollToBottom = () => {
        bottomRef.current.scrollIntoView({ behavior: "smooth" })
    };

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
            scrollToBottom();
        });
        // Invoke joining the current conversation:
        conn.invoke(config.SIGNALR_CONVERSATION_HUB_JOIN_CONVERSATION, id);
        // Dispatch the connection into the store:
        storeConnection(conn);
    };

    // useEffect hook for getting the conversation and setting up the SignalR connection:
    useEffect(() => {
        async function getConversation() {
            // Save the id in the store so other components can use it:
            storeId(id);
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
            scrollToBottom();
        }
        getConversation();
        return () => { };
    }, []);

    // Return our markup:
    return (
        <>
            <div className={classes.hidden}>{update}</div>
            <Box className={classes.box}>
                <Grid className={classes.grid} container spacing={3}>
                    <Grid id='message-box' item xs={12} className={`${classes.contentGrid} ${classes.spaceGrid}`}>
                        {messagesRef.current && messagesRef.current.length > 0 && messagesRef.current.map(message =>
                            <div key={message.id} className={classes.messageContainer}>
                                <div className={classes.center}>
                                    {formatDateWithTime(message.datePostedUTC)}
                                </div>
                                {message.messageBody &&
                                    <div className={userId === message.userId ? classes.right : classes.left}>
                                        <LazyLoad>
                                            <Avatar className={userId === message.userId ? classes.rightAvatar : classes.leftAvatar} src={message.profilePicUri} />
                                        </LazyLoad>
                                        <Card className={userId === message.userId ? classes.rightCard : classes.leftCard}>
                                            <CardHeader
                                                disableTypography={true}
                                                title={<div className={userId === message.userId ? classes.darkHeaderText : classes.lightHeaderText}>{message.username}</div>}
                                                subheader={<div className={userId === message.userId ? classes.darkText : classes.lightText}>{message.messageBody}</div>}
                                            />
                                        </Card>
                                    </div>}
                                {message.mediaUri &&
                                    <div className={userId === message.userId ? classes.right : classes.left}>
                                        <LazyLoad>
                                            <Avatar className={userId === message.userId ? classes.rightAvatar : classes.leftAvatar} src={message.profilePicUri} />
                                        </LazyLoad>
                                        {message.mediaType == 0 ? (
                                            <LazyLoad>
                                                <img src={message.mediaUri} alt="Image couldn't load or was deleted :(" className={userId === message.userId ? `${classes.img} ${classes.right}` : `${classes.img} ${classes.left}`} />
                                            </LazyLoad>
                                        ) : (
                                                <LazyLoad>
                                                    <video className={userId === message.userId ? `${classes.video} ${classes.right}` : `${classes.video} ${classes.left}`} loop controls autoPlay>
                                                        <source src={message.mediaUri} type="video/mp4" />
                                                        <source src={message.mediaUri} type="video/webm" />
                                                        <source src={message.mediaUri} type="video/ogg" />
                                                        <p className={classes.lightText}>Your browser does not support our videos :(</p>
                                                    </video>
                                                </LazyLoad>
                                            )}
                                    </div>}
                            </div>)}
                        <FadeIn>
                            <div className={classes.center} ref={bottomRef}><Emoji text=":zap:" />You're all up to date :)</div>
                        </FadeIn>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}
