import React, { useState, useEffect } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import config from '../config.json';
import useRequest from '../hooks/useRequest';
import useAuth from "../hooks/useAuth";
import { Link as RouterLink } from 'react-router-dom';
import {
    Box,
    IconButton,
    CardHeader,
    Card,
    Avatar,
    Tooltip,
    Grid,
    Link
} from '@material-ui/core';
import { AvatarGroup } from '@material-ui/lab';

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
    text: {
        color: theme.text
    },
    link: {
        textDecoration: "none",
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

// Messages component for rendering the messages page (for viewing all conversation the current user has):
export default function Messages() {
    // Create styles and state:
    const classes = useStyles();
    const [conversations, setConversations] = useState([]);
    const { get } = useRequest();
    const { getUserId } = useAuth();
    const userId = getUserId();

    // useEffect hook for getting all a user's conversations:
    useEffect(() => {
        async function getConversations() {
            // Send get request for conversations:
            const response = await get(config.MESSAGING_GET_ALL_CONVERSATIONS_GET, {
                userId: userId
            });
            // On success set the data in state:
            if (response.success) {
                setConversations(response.data);
            }
        }
        getConversations();
        return () => { };
    }, []);

    // Return our markup:
    return (
        <Box className={classes.box}>
            <Grid className={classes.grid} container spacing={3}>
                <Grid item xs={12} className={`${classes.contentGrid} ${classes.spaceGrid}`}>
                    {conversations && conversations.length > 0 ? conversations.map(conversation =>
                        <Link
                            key={conversation.id}
                            className={classes.link}
                            component={RouterLink}
                            to={`/chat/${conversation.id}`}>
                            <Card className={classes.card} key={conversation.id}>
                                <CardHeader
                                    key={conversation.id}
                                    avatar={
                                        <AvatarGroup>
                                            {conversation.users && conversation.users.length > 0 ?
                                                (conversation.users[0].id !== userId ?
                                                    <Avatar className={classes.avatar} src={conversation.users[0].profilePicUri} />
                                                    : <></>)
                                                : <></>}
                                            {conversation.users && conversation.users.length > 1 ?
                                                (conversation.users[1].id !== userId ?
                                                    <Avatar className={classes.avatar} src={conversation.users[1].profilePicUri} />
                                                    : <></>)
                                                : <></>}
                                            {conversation.users && conversation.users.length > 2 ?
                                                (conversation.users[2].id !== userId ?
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
                                        (user.id !== userId ?
                                            user.username
                                            : <></>)
                                    )
                                        : conversation.conversationName}
                                    subheader={conversation.messages && conversation.messages.length > 0 ?
                                        conversation.messages[conversation.messages.length - 1].messageBody
                                        : <></>}
                                    className={classes.text}
                                />
                            </Card>
                        </Link>
                    ) :
                        <></>}
                </Grid>
            </Grid>
        </Box>
    );
}
