import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import config from '../config.json';
import { formatDateWithTime, currentTicks } from "../helpers/dateHelper";
import useAuth from "../hooks/useAuth";
import FadeIn from 'react-fade-in';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import Axios from "axios";
import useRequest from '../hooks/useRequest';
import SendIcon from '@material-ui/icons/Send';
import { HubConnectionBuilder } from '@aspnet/signalr';
import { FilePicker } from "react-file-picker";
import LazyLoad from 'react-lazyload';
import Emoji from 'react-emoji-render';
import Carousel, { Dots } from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import {
    Box,
    Tooltip,
    CardHeader,
    IconButton,
    CardContent,
    TextField,
    Badge,
    Card,
    Avatar,
    Grid,
} from '@material-ui/core';

// Trevor Moore
// CST-451
// 2/9/2020
// This is my own work.

// Create CSS styling:
const useStyles = makeStyles(theme => ({
    card: {
        width: "auto",
        marginBottom: theme.spacing(4)
    },
    avatar: {
        backgroundColor: "rgb(147,112,219)"
    },
    hidden: {
        display: "none"
    },
    conversations: {
        height: "80vh",
        overflow: 'scroll'
    },
    messagesContainer: {
        height: "80vh",
    },
    messages: {
        height: "64vh",
        overflow: 'scroll'
    },
    commentContainer: {
        display: 'flex',
        alignItems: 'center',
        margin: '14px 16px 16px 16px'
    },
    convoTitleContainer: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '16px',
        alignItems: 'center',
        margin: '16px 16px 16px 16px',
        color: theme.text,
    },
    commentInput: {
        width: "100%",
    },
    commentCard: {
        marginBottom: '15px',
        alignItems: 'center',
        display: 'flex',
        '&:hover': {
            cursor: 'pointer'
        }
    },
    filePreview: {
        transform: 'translateY(-103%)',
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        margin: '14px 16px 16px 16px'
    },
    mediaPreview: {
        maxHeight: '40vh',
        maxWidth: '40vw',
        outline: 'none',
    },
    text: {
        color: theme.text
    },
    link: {
        textDecoration: "none",
        cursor: "pointer"
    },
    iconButtons: {
        color: theme.general.light,
    },
    box: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
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
        left: '31.5%',
        width: '54%',
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
    stats: {
        paddingLeft: '4px',
        fontSize: '16px'
    },
    center: {
        textAlign: 'center',
        color: theme.lightText
    },
    thingy: {
        textAlign: 'center',
        margin: 'auto',
        color: theme.lightText
    },
    otherThingy: {
        marginBottom: theme.spacing(2),
        fontSize: '16px',
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 'auto',
        color: theme.lightText,
    },
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
    inputBox: {
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        marginTop: theme.spacing(2)
    },
    innerGrid: {
        display: "flex"
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
        marginLeft: "10px",
        marginRight: "10px",
        '&:hover': {
            cursor: "pointer"
        }
    },
    messageVideo: {
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
    convoCard: {
        float: 'left',
        width: '100%',
        display: 'flex',
        cursor: "pointer",
        '&:hover': {
            cursor: "pointer"
        }
    },
    messageContainer: {
        width: '100%',
        display: 'inline-grid'
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'block',
        },
    },
    sectionMobile: {
        display: 'block',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    carousel: {
        marginBottom: '15px'
    },
    profileThing: {
        fontSize: '8px',
        display: 'grid',
    },
    mobileAvatar: {
        margin: 'auto'
    },
    mobileBottom: {
        marginBottom: '100px'
    },
    ellipsis: {
        maxWidth: '60px',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden'
    },
    username: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
}));

// Messages component for rendering the messages page (for viewing all conversation the current user has):
export default function Messages() {
    // Create styles and state:
    const classes = useStyles();
    const [conversations, setConversations] = useState([]);
    const [update, setUpdate] = useState(currentTicks());
    const [messageBody, setMessageBody] = useState("");
    const [messageFile, setMessageFile] = useState(null);
    const [convoSelected, setConvoSelected] = useState(false);
    const [media, setMedia] = useState(null);
    const [isImage, setIsImage] = useState(false);
    const [isVideo, setIsVideo] = useState(false);
    const { getUserId, getConnection, storeId, storeConnection, resetConnection, getId, getToken } = useAuth();
    const userId = getUserId();
    const { get } = useRequest();
    const connection = getConnection();
    const messagesRef = useRef(null);
    const currentId = getId();
    const userToken = getToken();
    const bottomRef = useRef(null);
    // Our state change handlers:
    const scrollToBottom = () => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };
    const handleMessageFileChange = file => {
        let reader = new FileReader();
        reader.onloadend = () => {
            setMessageFile(file);
            setMedia(reader.result);
        }
        reader.readAsDataURL(file);
        let extension = file.name.split('.').pop().toLowerCase(),
            image = ["jpeg", "jpg", "img", "png"].indexOf(extension) > -1,
            video = ["mov", "mp4", "wmv", "avi"].indexOf(extension) > -1;
        setIsImage(image);
        setIsVideo(video);
    };
    const removeFile = () => {
        setMessageFile(null);
        setMedia(null);
        setIsImage(false);
        setIsVideo(false);
    };
    const handleMessageBodyChange = e => {
        setMessageBody(e.target.value);
    };
    const handleMessageClose = () => {
        setMessageBody("");
        setMessageFile(null);
        setMedia(null);
        setIsImage(false);
        setIsVideo(false);
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
    const establishConnection = (conn, id) => {
        // Invoke joining the current conversation:
        conn.invoke(config.SIGNALR_CONVERSATION_HUB_JOIN_CONVERSATION, id);
        // Dispatch the connection into the store:
        storeConnection(conn);
    };
    // For getting the conversation and setting up the SignalR connection:
    const getConversation = async (id) => {
        setConvoSelected(true);
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
            establishConnection(connection, id);
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
            establishConnection(conn, id);
        }
        scrollToBottom();
    };
    const getConversations = async () => {
        // Send get request for conversations:
        const response = await get(config.MESSAGING_GET_ALL_CONVERSATIONS_GET, {
            userId: userId
        });
        // On success set the data in state:
        if (response.success) {
            setConversations(response.data);
        }
    };
    const keyPressed = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };
    // useEffect hook for getting all a user's conversations:
    useEffect(() => {
        async function getSignalRConnection() {
            if (!connection) {
                // Build the SignalR connection and start it:
                const conn = new HubConnectionBuilder()
                    .withUrl(config.SIGNALR_CONVERSATION_HUB)
                    .build();
                // Start the SignalR connection and start it:
                await conn.start()
                    .catch((error) => console.log('Error while starting connection :(  Error:' + error));
                console.log('Connected to SignalR!');
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
                storeConnection(conn);
            }
        }
        getSignalRConnection();
        getConversations();
        return () => { };
    }, []);
    // Return our markup:
    return (
        <>
            <div className={classes.hidden}>{update}</div>
            <Box className={classes.box}>
                <Grid className={classes.grid} container spacing={3}>
                    <Grid item xs={3} className={`${classes.contentGrid} ${classes.spaceGrid}`}>
                        <Carousel
                            className={`${classes.sectionMobile} ${classes.carousel}`}
                            slidesPerPage={conversations && conversations.length < 7 ? conversations.length : 6}
                            infinite
                        >
                            {conversations && conversations.length > 0 && conversations.map(conversation =>
                                <div key={conversation.id} className={`${classes.profileThing} ${classes.lightText}`} onClick={() => getConversation(conversation.id)}>
                                    {conversation.users && conversation.users.map(user =>
                                        (user.id !== userId &&
                                            <Avatar className={classes.mobileAvatar} src={user.profilePicUri} />))}
                                    {conversation.users && conversation.users.map(user =>
                                        (user.id !== userId &&
                                            <div className={classes.ellipsis}>{user.username}</div>))}
                                </div>)}
                        </Carousel>
                        {convoSelected ?
                            (conversations && conversations.length > 0 && conversations.find(convo => convo.id === currentId).users.map(user => (user.id !== userId) && <div className={classes.otherThingy}>{user.username}</div>))
                            :
                            <div className={classes.otherThingy}>Messages</div>}
                        <div className={classes.sectionMobile}>
                            {messagesRef.current && messagesRef.current.length > 0 ?
                                <>
                                    {messagesRef.current.map(message =>
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
                                                                <video className={userId === message.userId ? `${classes.messageVideo} ${classes.right}` : `${classes.messageVideo} ${classes.left}`} loop controls autoPlay>
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
                                        <div className={`${classes.center} ${classes.mobileBottom}`} ref={bottomRef}><Emoji text=":zap:" />You're all up to date :)</div>
                                    </FadeIn>
                                </>
                                :
                                (convoSelected ?
                                    <div className={classes.thingy}>
                                        Conversation is empty... send your first message! <Emoji text=":smile:" />
                                    </div>
                                    :
                                    <div className={classes.thingy}>
                                        {conversations && conversations.length > 0 ?
                                            <>Select a conversation to see your messages <Emoji text=":zap:" /></>
                                            :
                                            <>You have no messages... find a friend to send your first message! <Emoji text=":smile:" /></>}
                                    </div>)}
                        </div>
                        <Card className={`${classes.card} ${classes.sectionDesktop}`}>
                            <CardContent className={classes.conversations}>
                                {conversations && conversations.length > 0 && conversations.map(conversation =>
                                    <div key={conversation.id} className={`${classes.convoCard} ${classes.lightText}`} onClick={() => getConversation(conversation.id)}>
                                        {conversation.users && conversation.users.map(user =>
                                            (user.id !== userId &&
                                                <Avatar className={classes.leftAvatar} src={user.profilePicUri} />))}
                                        {conversation.users && conversation.users.map(user =>
                                            (user.id !== userId &&
                                                <div className={classes.username}>{user.username}</div>))}
                                    </div>)}
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={9} className={`${classes.profileGrid} ${classes.spaceGrid}`}>
                        <Card className={classes.messagesContainer}>
                            <Box className={classes.convoTitleContainer}>
                                {convoSelected ?
                                    (conversations && conversations.length > 0 && conversations.find(convo => convo.id === currentId).users.map(user => (user.id !== userId) && user.username))
                                    :
                                    'Messages'}
                            </Box>
                            <CardContent className={classes.messages}>
                                {messagesRef.current && messagesRef.current.length > 0 ?
                                    <>
                                        {messagesRef.current.map(message =>
                                            <div key={message.id} className={classes.messageContainer}>
                                                <div className={classes.center}>
                                                    {formatDateWithTime(message.datePostedUTC)}
                                                </div>
                                                {message.messageBody &&
                                                    <div className={userId === message.userId ? classes.right : classes.left}>
                                                        <Avatar className={userId === message.userId ? classes.rightAvatar : classes.leftAvatar} src={message.profilePicUri} />
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
                                                        <Avatar className={userId === message.userId ? classes.rightAvatar : classes.leftAvatar} src={message.profilePicUri} />
                                                        {message.mediaType == 0 ? (
                                                            <img src={message.mediaUri} alt="Image couldn't load or was deleted :(" className={userId === message.userId ? `${classes.img} ${classes.right}` : `${classes.img} ${classes.left}`} />
                                                        ) : (
                                                                <video className={userId === message.userId ? `${classes.messageVideo} ${classes.right}` : `${classes.messageVideo} ${classes.left}`} loop controls autoPlay>
                                                                    <source src={message.mediaUri} type="video/mp4" />
                                                                    <source src={message.mediaUri} type="video/webm" />
                                                                    <source src={message.mediaUri} type="video/ogg" />
                                                                    <p className={classes.lightText}>Your browser does not support our videos :(</p>
                                                                </video>
                                                            )}
                                                    </div>}
                                            </div>)}
                                        <FadeIn>
                                            <div className={classes.center}><Emoji text=":zap:" />You're all up to date :)</div>
                                        </FadeIn>
                                    </>
                                    :
                                    (convoSelected ?
                                        <div className={classes.thingy}>
                                            Conversation is empty... send your first message! <Emoji text=":smile:" />
                                        </div>
                                        :
                                        <div className={classes.thingy}>
                                            {conversations && conversations.length > 0 ?
                                                <>Select a conversation to see your messages <Emoji text=":zap:" /></>
                                                :
                                                <>You have no messages... find a friend to send your first message! <Emoji text=":smile:" /></>}
                                        </div>)}
                            </CardContent>
                            {media &&
                                <div className={classes.filePreview}>
                                    {isImage &&
                                        <LazyLoad>
                                            <img src={media} className={classes.mediaPreview} />
                                        </LazyLoad>}
                                    {isVideo &&
                                        <LazyLoad>
                                            <video className={classes.mediaPreview} loop controls autoPlay>
                                                <source src={media} type="video/mp4" />
                                                <source src={media} type="video/webm" />
                                                <source src={media} type="video/ogg" />
                                                <p className={classes.text}>Your browser does not support our videos :(</p>
                                            </video>
                                        </LazyLoad>}
                                </div>}
                            <Box className={classes.commentContainer}>
                                <TextField
                                    className={classes.commentInput}
                                    value={messageBody}
                                    onChange={handleMessageBodyChange}
                                    onKeyPress={keyPressed}
                                    label="Send a Message :)"
                                    variant="outlined"
                                />
                                {messageFile ?
                                    <Tooltip title='Remove File'>
                                        <IconButton
                                            className={classes.iconButtons}
                                            onClick={removeFile}>
                                            <HighlightOffIcon />
                                        </IconButton>
                                    </Tooltip>
                                    :
                                    <FilePicker
                                        extensions={["jpeg", "mov", "mp4", "jpg", "img", "png", "wmv", "avi"]}
                                        onChange={handleMessageFileChange}
                                        onKeyPress={keyPressed}
                                        className={classes.fileUpload}
                                        maxSize='999999'
                                    >
                                        <Tooltip title='Add Picture or Video'>
                                            <IconButton className={classes.iconButtons}>
                                                <AddPhotoAlternateIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </FilePicker>}
                                <IconButton
                                    className={classes.uploadButton}
                                    onClick={sendMessage}>
                                    <SendIcon />
                                </IconButton>
                            </Box>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}
