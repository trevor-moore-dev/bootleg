import React, { useState, useEffect } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import config from '../config.json';
import useRequest from '../hooks/useRequest';
import useAuth from "../hooks/useAuth";
import LazyLoad from 'react-lazyload';
import { formatDate } from "../helpers/dateHelper";
import {
    Box,
    IconButton,
    CardMedia,
    CardHeader,
    Card,
    CardActions,
    CardContent,
    Avatar,
    Tooltip,
    Grid,
    AvatarGroup,
    Link
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
    }
}));

// Home component for rendering the home page:
export default function Messages() {
    const classes = useStyles();
    const [conversations, setConversations] = useState([]);
    const { get } = useRequest();
    const { authState } = useAuth();

    useEffect(() => {
        async function getUploads() {
            const response = await get(config.MESSAGING_GET_ALL_CONVERSATIONS_GET, {
                userId: authState.user.id
            });
            if (response.success) {
                setConversations(response.data);
            }
        }
        getUploads();
        return () => { };
    }, []);

    return (
        <Box className={classes.box}>
            <Grid className={classes.grid} container spacing={3}>
                <Grid item xs={12} className={`${classes.contentGrid} ${classes.spaceGrid}`}>
                    {conversations && conversations.length > 0 ? conversations.map(conversation =>
                        <Card key={user.id} className={classes.card}>
                            <CardHeader
                                avatar={
                                    <AvatarGroup>
                                        {conversation.users && conversation.users.length > 0 ?
                                            (conversation.users[0].id !== authState.user.id ?
                                                <Avatar className={classes.avatar} src={conversation.users[0].profilePicUri} />
                                                : <></>)
                                            : <></>}
                                        {conversation.users && conversation.users.length > 1 ?
                                            (conversation.users[1].id !== authState.user.id ?
                                                <Avatar className={classes.avatar} src={conversation.users[1].profilePicUri} />
                                                : <></>)
                                            : <></>}
                                        {conversation.users && conversation.users.length > 2 ?
                                            (conversation.users[2].id !== authState.user.id ?
                                                <Avatar className={classes.avatar} src={conversation.users[2].profilePicUri} />
                                                : <></>)
                                            : <></>}
                                        {conversation.users && conversation.users.length > 3 ?
                                            <Tooltip>
                                                <Avatar>+{conversation.users.length - 3}</Avatar>
                                            </Tooltip>
                                            : <></>}
                                    </AvatarGroup>
                                }
                                action={
                                    <IconButton color="inherit">
                                        <MoreVertIcon />
                                    </IconButton>
                                }
                                title={conversation.users && conversation.users.length == 2 ? conversation.users.map(user =>
                                    (user.id !== authState.user.id ?
                                        user.username
                                        : <></>)
                                )
                                    : conversation.conversationName}
                                subheader={conversation.messages && conversation.messages.length > 0 ?
                                    conversation.messages[conversation.messages.length - 1].messageBody
                                    : <></>}
                                className={classes.text}
                            />
                            <CardContent>
                                <Link
                                    component={RouterLink}
                                    to={`/account/${user.id}`}>
                                    <p className={classes.text}>{user.username}</p>
                                </Link>
                            </CardContent>
                        </Card>
                    ) :
                        <></>}
                </Grid>
            </Grid>
        </Box>
    );
}
