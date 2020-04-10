import React, { useState, useEffect } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import config from '../config.json';
import useRequest from '../hooks/useRequest';
import useAuth from "../hooks/useAuth";
import LazyLoad from 'react-lazyload';
import { formatDate } from "../helpers/dateHelper";
import { Link as RouterLink } from 'react-router-dom';
import Carousel, { Dots } from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';
import Axios from "axios";
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import AddIcon from '@material-ui/icons/Add';
import { FilePicker } from "react-file-picker";
import ImageUploader from 'react-images-upload';
import SendIcon from '@material-ui/icons/Send';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import {
    Box,
    IconButton,
    CardMedia,
    CardHeader,
    Card,
    Badge,
    Tooltip,
    TextField,
    CardContent,
    Avatar,
    Grid,
    Link
} from '@material-ui/core';

// Trevor Moore
// CST-451
// 2/9/2020
// This is my own work.

// Making our styles:
const useStyles = makeStyles(theme => ({
    card: {
        width: "auto",
        marginBottom: theme.spacing(4),
        minHeight: '27vh'
    },
    avatar: {
        backgroundColor: "rgb(147,112,219)"
    },
    text: {
        textDecoration: "none",
        color: theme.text,
        "&:hover": {
            textDecoration: "none",
        }
    },
    link: {
        textDecoration: "none",
        color: theme.general.medium,
        cursor: "pointer",
        "&:hover": {
            textDecoration: "none",
        }
    },
    video: {
        outline: "none",
        width: "100%"
    },
    img: {
        width: "100%"
    },
    iconButtons: {
        color: theme.general.light
    },
    box: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputBox: {
        display: 'flex',
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
        left: '61%',
        width: '24%',
        [theme.breakpoints.up('md')]: {
            display: 'block',
        },
    },
    spaceGrid: {
        paddingTop: "48px!important",
        paddingBottom: "48px!important",
        paddingLeft: "12px!important",
        paddingRight: "12px!important",
    },
    postInput: {
        width: '100%'
    },
    stats: {
        paddingLeft: '4px',
        fontSize: '16px'
    },
    lightText: {
        color: theme.text
    },
    profileThing: {
        fontSize: '8px',
        display: 'grid'
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
    centeralign: {
        margin: 'auto',
        display: 'block'
    }
}));

// Explore component for rendering the create page:
export default function AddPost() {
    // Create our styles and such, and create our state:
    const { getUserId, getToken, authState } = useAuth();
    const classes = useStyles();
    const [followings, setFollowings] = useState([]);
    const { get } = useRequest();
    const [contentBody, setContentBody] = useState("");
    const [contentFile, setContentFile] = useState(null);
    const [media, setMedia] = useState(null);
    const [isImage, setIsImage] = useState(false);
    const [isVideo, setIsVideo] = useState(false);
    const [newPostId, setNewPostId] = useState("");
    const userToken = getToken();
    const userId = getUserId();

    // Our state change handlers:
    const handleContentFileChange = file => {
        let reader = new FileReader();
        reader.onloadend = () => {
            setContentFile(file);
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
        setContentFile(null);
        setMedia(null);
        setIsImage(false);
        setIsVideo(false);
    };
    const handleContentBodyChange = e => {
        setContentBody(e.target.value);
    };
    const uploadPost = async () => {
        // Create new FormData object to hold files:
        let formData = new FormData();
        // Append file if it's there:
        if (contentFile) {
            formData.append('file', contentFile);
        }
        // Append contentBody and userId:
        formData.append('contentBody', contentBody);
        formData.append('userId', userId);
        // Send post request:
        let response = await Axios.post(
            config.CONTENT_UPLOAD_CONTENT_POST,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: "Bearer " + userToken
                }
            });
        if (response.data.success) {
            setNewPostId(response.data.id);
        }
    };

    // useEffect hook for getting the current user's followings:
    useEffect(() => {
        async function getUserFollowings() {
            // Send post request to get all followings:
            const response = await get(config.USER_GET_FOLLOWINGS_GET, {
                userId: authState.user.id
            });
            // On success set the data:
            if (response.success) {
                setFollowings(response.data);
            }
        }
        getUserFollowings();
        return () => { };
    }, []);

    // Return our markup:
    return (
        <Box className={classes.box}>
            <Grid className={classes.grid} container spacing={3}>
                <Grid item xs={8} className={`${classes.contentGrid} ${classes.spaceGrid}`}>
                    <Card className={classes.card}>
                        <CardHeader
                            title='New Post'
                            subheader={formatDate(new Date())}
                            className={classes.text}
                        />
                        <CardMedia>
                            {media &&
                                <>
                                    {isImage &&
                                        <LazyLoad>
                                            <img src={media} alt="Image couldn't load or was deleted :(" className={classes.img} />
                                        </LazyLoad>}
                                    {isVideo &&
                                        <LazyLoad>
                                            <video className={classes.video} loop controls autoPlay>
                                                <source src={media} type="video/mp4" />
                                                <source src={media} type="video/webm" />
                                                <source src={media} type="video/ogg" />
                                                <p className={classes.text}>Your browser does not support our videos :(</p>
                                            </video>
                                        </LazyLoad>}
                                </>}
                        </CardMedia>
                        <CardContent>
                            <Box className={classes.inputBox}>
                                <TextField
                                    className={classes.postInput}
                                    autoFocus
                                    multiline
                                    rows="2"
                                    value={contentBody}
                                    onChange={handleContentBodyChange}
                                    rowsMax="8"
                                    label="What's on your mind?"
                                    variant="outlined"
                                />
                                <div>
                                    {contentFile && contentFile.length > 0 ?
                                        <FilePicker
                                            extensions={["jpeg", "mov", "mp4", "jpg", "img", "png", "wmv", "avi"]}
                                            onChange={handleContentFileChange}
                                            className={classes.fileUpload}
                                        >
                                            <Tooltip title='Add Picture or Video'>
                                                <IconButton color="inherit" className={classes.filePickerButton}>
                                                    <AddPhotoAlternateIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </FilePicker>
                                        :
                                        <Tooltip title='Remove File'>
                                            <IconButton
                                                color="inherit"
                                                className={classes.filePickerButton}
                                                onClick={removeFile}>
                                                <HighlightOffIcon />
                                            </IconButton>
                                        </Tooltip>}
                                    <Tooltip title='Post'>
                                        <IconButton
                                            className={classes.uploadButton}
                                            onClick={uploadPost}
                                            color='primary'>
                                            <SendIcon />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={4} className={`${classes.profileGrid} ${classes.spaceGrid}`}>
                    <Card className={classes.card}>
                        <CardHeader
                            avatar={
                                <LazyLoad>
                                    <Avatar className={classes.avatar} src={authState.user.profilePic} />
                                </LazyLoad>
                            }
                            title={'Welcome, ' + authState.user.email}
                            className={classes.text}
                        />
                        <CardContent>
                            <p className={classes.text}>See what's new...</p>
                            <Carousel
                                slidesPerPage='5'
                                className={classes.carousel}
                                infinite
                            >
                                {followings && followings.length > 0 && followings.map(user =>
                                    <div key={user.id} className={`${classes.profileThing} ${classes.lightText}`}>
                                        <Link
                                            className={classes.link}
                                            component={RouterLink}
                                            to={`/user/${user.id}`}>
                                            <Avatar className={classes.mobileAvatar} src={user.profilePicUri} />
                                        </Link>
                                        <div className={classes.ellipsis}>{user.username}</div>
                                    </div>)}
                            </Carousel>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}