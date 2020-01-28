import React, { useState, useEffect } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import config from '../config.json';
import useRequest from '../hooks/useRequest';
import useAuth from "../hooks/useAuth";
import LazyLoad from 'react-lazyload';
import {
    Box,
    IconButton,
    CardMedia,
    CardHeader,
    Card,
    CardActions,
    CardContent,
    Avatar,
    GridList,
    GridListTile,
    Paper
} from '@material-ui/core';

// Trevor Moore
// CST-451
// 12/9/2019
// This is my own work.

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(1),
            width: theme.spacing(16),
            height: theme.spacing(16),
        },
    },
    card: {
        width: 700,
        marginBottom: "10px"
    },
    avatar: {
        backgroundColor: "rgb(147,112,219)"
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
    gridList: {
        width: 500,
        height: 450,
    },
}));

// Home component for rendering the home page:
export default function Account() {
    const classes = useStyles();
    const [user, setUser] = useState({});
    const [uploads, setUploads] = useState([]);
    const { get } = useRequest();
    const { authState } = useAuth();

    useEffect(() => {
        async function getUserContent() {
            const response = await get(config.USER_GET_USER_CONTENT_GET, {
                userId: authState.user.id
            });
            if (response.success) {
                setUser(response.data.item1);
                setUploads(response.data.item2);
            }
        }
        getUserContent();
        return () => { };
    }, []);

    return (
        <Box
            display='flex'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            className={classes.root}
        >
            <GridList cellHeight={160} className={classes.gridList} cols={5}>
                {uploads && uploads.length > 0 ? uploads.map(content => (
                    <GridListTile key={content.id} cols={1}>
                        {content.mediaUri ? (
                            <>
                                {content.mediaType == 0 ? (
                                    <LazyLoad>
                                        <img src={content.mediaUri} alt="Image couldn't load :(" className={classes.img} />
                                    </LazyLoad>
                                ) : (
                                        <LazyLoad>
                                            <video className={classes.video} loop controls autoPlay>
                                                <source src={content.mediaUri} type="video/mp4" />
                                                <source src={content.mediaUri} type="video/webm" />
                                                <source src={content.mediaUri} type="video/ogg" />
                                                <p className={classes.text}>Your browser does not support our videos :(</p>
                                            </video>
                                        </LazyLoad>
                                    )}
                            </>
                        ) : (
                                <></>
                            )}
                    </GridListTile>
                )) : <></>}
            </GridList>
        </Box>
    );
}
