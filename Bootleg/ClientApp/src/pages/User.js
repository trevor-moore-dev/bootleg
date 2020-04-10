import React, { useState, useEffect } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import config from '../config.json';
import useRequest from '../hooks/useRequest';
import useAuth from "../hooks/useAuth";
import LazyLoad from 'react-lazyload';
import { formatDate } from "../helpers/dateHelper";
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import EditIcon from '@material-ui/icons/Edit';
import CancelIcon from '@material-ui/icons/Cancel';
import { useParams } from "react-router-dom";
import { Link as RouterLink, Redirect } from 'react-router-dom';
import { FilePicker } from "react-file-picker";
import SendIcon from '@material-ui/icons/Send';
import Axios from "axios";
import PersonAddDisabledIcon from '@material-ui/icons/PersonAddDisabled';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import MailIcon from '@material-ui/icons/Mail';
import {
    Box,
    IconButton,
    CardMedia,
    CardHeader,
    Tooltip,
    Card,
    Avatar,
    Button,
    Divider,
    Grid,
    Link,
    TextField,
} from '@material-ui/core';

// Trevor Moore
// CST-451
// 2/9/2020
// This is my own work.

// Create CSS styles:
const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: "100%",
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(8),
        [theme.breakpoints.up('md')]: {
            paddingLeft: theme.spacing(20),
            paddingRight: theme.spacing(20),
        },
    },
    container: {
        display: 'flex',
        flexGrow: 1,
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    card: {
        width: '25%',
        margin: '10px',
        [theme.breakpoints.up('md')]: {
            margin: '40px'
        },
    },
    avatar: {
        backgroundColor: 'rgb(147,112,219)',
        width: theme.spacing(20),
        height: theme.spacing(20),
    },
    mousePointer: {
        cursor: "pointer",
        '&:hover': {
            cursor: "pointer"
        }
    },
    iconButtons: {
        color: theme.general.light
    },
    text: {
        color: theme.superb
    },
    center: {
        textAlign: 'center',
        [theme.breakpoints.up('md')]: {
            textAlign: 'left',
        },
    },
    info: {
        color: theme.superb,
        margin: '5px',
        textAlign: 'center',
        [theme.breakpoints.up('md')]: {
            textAlign: 'left',
        },
    },
    link: {
        textDecoration: "none",
        cursor: "pointer",
        "&:hover": {
            textDecoration: "none",
            cursor: "pointer",
        }
    },
    noUnderline: {
        textDecoration: "none",
        "&:hover": {
            textDecoration: "none",
        }
    },
    username: {
        color: theme.text,
        fontWeight: 'bold',
        fontSize: '20px',
        margin: '5px',
        textAlign: 'center',
        [theme.breakpoints.up('md')]: {
            textAlign: 'left',
        },
    },
    divider: {
        backgroundColor: theme.divider.backgroundColor,
        margin: '25px 15% 25px 15%',
    },
    mediaContent: {
        width: '100%',
        height: '100%',
        outline: 'none',
        objectFit: 'cover'
    },
    media: {
        textAlign: 'center',
        height: '100px',
        backgroundColor: 'rgba(0,0,0,1)',
        [theme.breakpoints.up('md')]: {
            height: '300px',
        },
    },
    accountDetailsContainer: {
        flexDirection: 'column',
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        [theme.breakpoints.up('md')]: {
            marginLeft: '50px',
            width: '20vw'
        },
    },
    actionsContainer: {
        textAlign: 'center',
    },
}));

// User component for rendering someone else's profile:
export default function User() {
    // Create our CSS classes and also setting the state data initially:
    const classes = useStyles();
    const { id } = useParams();
    const { getUserId, getToken } = useAuth();
    const userId = getUserId();
    const [uploads, setUploads] = useState([]);
    const { get, post } = useRequest();
    const [user, setUser] = useState({});
    const [isFollowing, setIsFollowing] = useState(false);
    const userToken = getToken();
    const [editAccount, setEditAccount] = useState(false);
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [profilePicUri, setProfilePicUri] = useState("");
    const [bio, setBio] = useState("");
    const [sendMessage, setSendMessage] = useState(false);

    // useEffect hook for getting the user and all the content they should have on their feet.
    useEffect(() => {
        async function getLoggedInUser() {
            // Send get request to get the user:
            const response = await get(config.USER_GET_USER_GET, {
                userId: userId
            });
            // On success set the data:
            if (response.success) {
                if (response.data.followingIds) {
                    setIsFollowing(response.data.followingIds.includes(id));
                }
            }
        }
        async function getUser() {
            // Send get request to get the user:
            const response = await get(config.USER_GET_USER_CONTENT_GET, {
                userId: id
            });
            // On success set the data:
            if (response.success) {
                setUser(response.data.item1);
                setUploads(response.data.item2);
            }
        }
        async function getUserContent() {
            // Make get request to get all the user's content:
            const response = await get(config.USER_GET_USER_CONTENT_GET, {
                userId: userId
            });
            // Set the corresponding state upon success:
            if (response.success) {
                setEmail(response.data.item1.email ? response.data.item1.email : '');
                setUsername(response.data.item1.username ? response.data.item1.username : '');
                setProfilePicUri(response.data.item1.profilePicUri ? response.data.item1.profilePicUri : '');
                setBio(response.data.item1.bio ? response.data.item1.bio : '');
                setUploads(response.data.item2);
            }
        }
        if (id === userId) {
            getUserContent()
        }
        else {
            getLoggedInUser();
            getUser();
        }
        return () => { };
    }, []);

    // State handler methods on change:
    const handleEmailChange = e => {
        setEmail(e.target.value);
    };
    const handleUsernameChange = e => {
        setUsername(e.target.value);
    };
    const handleBioChange = e => {
        setBio(e.target.value);
    };
    const handleEditAccount = () => {
        setEditAccount(!editAccount);
    };

    // Method for making the request to update a user's content:
    const makeUserUpdateRequest = async (formData, notProfilePicUpdate) => {
        // Append user id if it's there:
        if (userId) {
            formData.append('userId', userId);
        }
        // Send request for updating the user's post:
        let response = await Axios.post(
            config.USER_UPDATE_USER_POST,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: "Bearer " + userToken
                }
            });
        // Upon success set the state data:
        if (response.data.success) {
            setEmail(response.data.data.email ? response.data.data.email : '');
            setUsername(response.data.data.username ? response.data.data.username : '');
            setProfilePicUri(response.data.data.profilePicUri ? response.data.data.profilePicUri : '');
            setBio(response.data.data.bio ? response.data.data.bio : '');

            if (notProfilePicUpdate) {
                setEditAccount(!editAccount);
            }
        }
    };

    // Method for handling updating account:
    const handleUpdateAccount = async () => {
        // Create form data object:
        let formData = new FormData();
        // Append corresponding data if it's there:
        if (username) {
            formData.append('username', username);
        }
        if (email) {
            formData.append('email', email);
        }
        if (bio) {
            formData.append('bio', bio);
        }
        // Make post request:
        makeUserUpdateRequest(formData, true);
    };


    // Method for handling a profile pic change:
    const handleProfilePicChange = async (profilePic) => {
        // Create form data object:
        let formData = new FormData();
        // Append corresponding data if it's there:
        if (profilePic) {
            formData.append('file', profilePic);
        }
        // Make post request:
        makeUserUpdateRequest(formData, false);
    };

    // Method for following a user:
    const followUser = async () => {
        // Send post request to the user:
        const response = await post(config.USER_FOLLOW_USER_POST, {
            Id: id,
            Data: userId
        });
        // On success set the data:
        if (response.success) {
            if (response.data.followingIds) {
                setIsFollowing(response.data.followingIds.includes(id));
            }
        }
    };

    // Method for unfollowing a user:
    const unfollowUser = async () => {
        // Send post request to the user:
        const response = await post(config.USER_UNFOLLOW_USER_POST, {
            Id: id,
            Data: userId
        });
        // On success set the data:
        if (response.success) {
            if (response.data.followingIds) {
                setIsFollowing(response.data.followingIds.includes(id));
            }
        }
    };

    // Method for messaging a user:
    const messageUser = async (id1, id2) => {
        // Make post request to send a new message (this invokes all websocket connections to this group):
        let response = await post(config.MESSAGING_CREATE_CONVERSATION_POST, {
            Data: [
                id1,
                id2
            ]
        });
        if (response.success) {
            setSendMessage(true);
        }
    };
    const keyPressed = (e) => {
        if (e.key === 'Enter') {
            handleUpdateAccount();
        }
    };
    // Return our markup:
    return (
        <Box className={classes.root}>
            {sendMessage && <Redirect to='/messages' />}
            {id === userId ?
                <div className={classes.container}>
                    <div className={classes.mousePointer}>
                        <FilePicker
                            extensions={["jpeg", "mov", "mp4", "jpg", "img", "png", "wmv", "avi"]}
                            onChange={handleProfilePicChange}
                            maxSize='999999'
                        >
                            <Avatar className={classes.avatar} src={profilePicUri} />
                        </FilePicker>
                    </div>
                    <div className={classes.accountDetailsContainer}>
                        {editAccount ? <TextField value={username} label='Username' onChange={handleUsernameChange} onKeyPress={keyPressed} className={classes.info} variant="filled" /> :
                            <div className={classes.username}>
                                {username}
                                <Tooltip title='Edit' placement='right'>
                                    <IconButton className={classes.iconButtons} onClick={handleEditAccount}>
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                            </div>}
                        {editAccount ? <TextField value={bio} label='Bio' onChange={handleBioChange} onKeyPress={keyPressed} className={classes.info} variant="filled" /> : <div className={classes.info}>{bio}</div>}
                        {editAccount ? <TextField value={email} label='Email' onChange={handleEmailChange} onKeyPress={keyPressed} className={classes.info} variant="filled" /> : <div className={classes.info}>{email}</div>}
                        {editAccount &&
                            <div className={classes.actionsContainer}>
                                <Tooltip title='Cancel'>
                                    <IconButton className={classes.iconButtons} onClick={handleEditAccount}>
                                        <CancelIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title='Save'>
                                    <IconButton className={classes.iconButtons} onClick={handleUpdateAccount}>
                                        <DoneOutlineIcon />
                                    </IconButton>
                                </Tooltip>
                            </div>}
                    </div>
                </div>
                :
                <div className={classes.container}>
                    <Avatar className={classes.avatar} src={user.profilePicUri} />
                    <div className={classes.accountDetailsContainer}>
                        <div className={classes.username}>{user.username}</div>
                        <div className={classes.info}>{user.bio}</div>
                        <div className={classes.center}>
                            {isFollowing ?
                                <Tooltip title='Unfollow'>
                                    <IconButton
                                        className={classes.iconButtons}
                                        onClick={unfollowUser}>
                                        <PersonAddDisabledIcon />
                                    </IconButton>
                                </Tooltip> :
                                <Tooltip title='Follow'>
                                    <IconButton
                                        className={classes.iconButtons}
                                        onClick={followUser}>
                                        <PersonAddIcon />
                                    </IconButton>
                                </Tooltip>}
                            <Link
                                onClick={() => messageUser(userId, id)}
                                className={classes.noUnderline}>
                                <Tooltip title='Send Message'>
                                    <IconButton className={classes.iconButtons}>
                                        <MailIcon />
                                    </IconButton>
                                </Tooltip>
                            </Link>
                        </div>
                    </div>
                </div>}
            <Grid container spacing={3}>
                <Grid item xs className={classes.container}>
                    {id === userId && !(uploads && uploads.length > 0) &&
                        <Link
                            className={classes.link}
                            component={RouterLink}
                            to="/create">
                            <Button variant="contained">
                                Add Post
                            </Button>
                        </Link>}
                    {uploads && uploads.length > 0 && uploads.map(content =>
                        <div key={content.id} className={`${classes.media} ${classes.card}`}>
                            <Link
                                className={classes.link}
                                component={RouterLink}
                                to={`/post/${content.id}`}>
                                {content.mediaType == 0 ?
                                    <LazyLoad>
                                        <img src={content.mediaUri} alt="Image couldn't load or was deleted :(" className={classes.mediaContent} />
                                    </LazyLoad>
                                    :
                                    <LazyLoad>
                                        <video className={classes.mediaContent} loop autoPlay>
                                            <source src={content.mediaUri} type="video/mp4" />
                                            <source src={content.mediaUri} type="video/webm" />
                                            <source src={content.mediaUri} type="video/ogg" />
                                            <p className={classes.text}>Your browser does not support our videos :(</p>
                                        </video>
                                    </LazyLoad>}
                            </Link>
                        </div>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
}