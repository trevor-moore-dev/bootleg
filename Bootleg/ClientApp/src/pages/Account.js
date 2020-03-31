import React, { useState, useEffect } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import EditIcon from '@material-ui/icons/Edit';
import CancelIcon from '@material-ui/icons/Cancel';
import config from '../config.json';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import useRequest from '../hooks/useRequest';
import useAuth from "../hooks/useAuth";
import LazyLoad from 'react-lazyload';
import { formatDate } from "../helpers/dateHelper";
import { FilePicker } from "react-file-picker";
import Axios from "axios";
import {
    Box,
    IconButton,
    CardMedia,
    CardHeader,
    Card,
    CardContent,
    Avatar,
    TextField,
    CardActions,
    Divider,
    Grid,
    Link
} from '@material-ui/core';

// Trevor Moore
// CST-451
// 2/8/2020
// This is my own work.

// Create our CSS styles:
const useStyles = makeStyles(theme => ({
    root: {
        paddingTop: theme.spacing(5)
    },
    container: {
        display: 'flex',
        flexGrow: 1,
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    card: {
        width: "auto",
        marginBottom: theme.spacing(4)
    },
    cardAvatar: {
        backgroundColor: 'rgb(147,112,219)',
    },
    avatar: {
        backgroundColor: 'rgb(147,112,219)',
        width: theme.spacing(20),
        height: theme.spacing(20),
    },
    mousePointer: {
        '&:hover': {
            mouse: "pointer"
        },
    },
    text: {
        color: theme.text
    },
    divider: {
        backgroundColor: theme.divider.backgroundColor,
        margin: '25px 15% 25px 15%',
    },
    video: {
        outline: 'none',
        width: '100%',
        height: '100%'
    },
    img: {
        width: '100%',
        verticalAlign: 'middle',
    },
    media: {
        textAlign: 'center',
        display: 'block',
        height: '300px',
        backgroundColor: 'rgba(0,0,0,1)',
        lineHeight: '300px',
    },
    accountDetailsContainer: {
        flexDirection: 'column',
        display: 'flex',
    },
}));

// Account component for rendering the current user's account page:
export default function Account() {
    // Create our styles and set our initial state values:
    const classes = useStyles();
    const [uploads, setUploads] = useState([]);
    const { get } = useRequest();
    const { getUserId, getToken } = useAuth();
    const userToken = getToken();
    const userId = getUserId();
    const [editAccount, setEditAccount] = useState(false);
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [username, setUsername] = useState("");
    const [profilePicUri, setProfilePicUri] = useState("");
    const [bio, setBio] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    // useEffect hook for getting all the user's content:
    useEffect(() => {
        async function getUserContent() {
            // Make get request to get all the user's content:
            const response = await get(config.USER_GET_USER_CONTENT_GET, {
                userId: userId
            });
            // Set the corresponding state upon success:
            if (response.success) {
                setEmail(response.data.item1.email ? response.data.item1.email : '');
                setPhone(response.data.item1.phone ? response.data.item1.phone : '');
                setUsername(response.data.item1.username ? response.data.item1.username : '');
                setProfilePicUri(response.data.item1.profilePicUri ? response.data.item1.profilePicUri : '');
                setBio(response.data.item1.bio ? response.data.item1.bio : '');
                setUploads(response.data.item2);
            }
        }
        getUserContent();
        return () => { };
    }, []);

    // State handler methods on change:
    const handleEmailChange = e => {
        setEmail(e.target.value);
    };
    const handlePhoneChange = e => {
        setPhone(e.target.value);
    };
    const handleUsernameChange = e => {
        setUsername(e.target.value);
    };
    const handleBioChange = e => {
        setBio(e.target.value);
    };
    const handleOldPasswordChange = e => {
        setOldPassword(e.target.value);
    };
    const handleNewPasswordChange = e => {
        setNewPassword(e.target.value);
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
            setPhone(response.data.data.phone ? response.data.data.phone : '');
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
        if (phone) {
            formData.append('phone', phone);
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

    // Return our markup:
    return (
        <Box className={classes.root}>
            <div className={classes.container}>
                <FilePicker
                    extensions={["jpeg", "mov", "mp4", "jpg", "img", "png", "wmv", "avi"]}
                    onChange={handleProfilePicChange}
                >
                    <Avatar className={classes.avatar} src={profilePicUri} />
                </FilePicker>
                <div className={classes.accountDetailsContainer}>
                    {editAccount ? <TextField value={username} onChange={handleUsernameChange} className={classes.text} /> : <div className={classes.text}>{username}</div>}
                    {editAccount ? <TextField value={bio} onChange={handleBioChange} className={classes.text} /> : <div className={classes.text}>{bio}</div>}
                    {editAccount ? <TextField value={email} onChange={handleEmailChange} className={classes.text} /> : <div className={classes.text}>{email}</div>}
                    {editAccount ? <TextField value={phone} onChange={handlePhoneChange} className={classes.text} /> : <div className={classes.text}>{phone}</div>}
                    <IconButton color="inherit" onClick={handleEditAccount}>
                        {editAccount ? <CancelIcon /> : <EditIcon />}
                    </IconButton>
                    {editAccount &&
                        <IconButton color="inherit" onClick={handleUpdateAccount}>
                            <DoneOutlineIcon />
                        </IconButton>}
                </div>
            </div>
            <Divider className={classes.divider} ariant="middle" />
            <Grid container spacing={3}>
                <Grid item xs className={classes.container}>
                    {uploads && uploads.length > 0 ? uploads.map(content => (
                        <Card key={content.id} className={classes.card}>
                            <CardHeader
                                avatar={
                                    <LazyLoad>
                                        <Avatar className={classes.cardAvatar} src={content.userProfilePicUri} />
                                    </LazyLoad>
                                }
                                title={content.userName}
                                subheader={formatDate(content.datePostedUTC)}
                                className={classes.text}
                            />
                            {content.mediaUri &&
                                <CardMedia
                                    className={classes.media}
                                >
                                    {content.mediaType == 0 ? (
                                        <LazyLoad>
                                            <img src={content.mediaUri} alt="Image couldn't load or was deleted :(" className={classes.img} />
                                        </LazyLoad>
                                    ) : (
                                            <LazyLoad>
                                                <video className={classes.video} loop autoPlay>
                                                    <source src={content.mediaUri} type="video/mp4" />
                                                    <source src={content.mediaUri} type="video/webm" />
                                                    <source src={content.mediaUri} type="video/ogg" />
                                                    <p className={classes.text}>Your browser does not support our videos :(</p>
                                                </video>
                                            </LazyLoad>
                                        )}
                                </CardMedia>}
                            <CardContent>
                                <p className={classes.text}>{content.contentBody}</p>
                            </CardContent>
                            <CardActions disableSpacing>
                                <IconButton color="primary">
                                    <ThumbUpAltIcon />
                                </IconButton>
                                <IconButton color="primary">
                                    <ThumbDownAltIcon />
                                </IconButton>
                                <IconButton className={classes.iconButtons}>
                                    <ChatBubbleIcon />
                                </IconButton>
                            </CardActions>
                        </Card>
                    )) :
                        <Card className={classes.card}>
                            <CardContent>
                                <p className={classes.text}>Welcome Boomer! Feel free to <Link className={classes.link}>post some content</Link>.</p>
                            </CardContent>
                        </Card>}
                </Grid>
            </Grid>
        </Box>
    );
}
