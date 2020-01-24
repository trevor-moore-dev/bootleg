import React, { useState, useEffect } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import config from '../config.json';
import useRequest from '../hooks/useRequest';
import useAuth from "../hooks/useAuth";
import {
	Box,
	IconButton,
	CardMedia,
	CardHeader,
	Card,
	CardActions,
	CardContent,
	Avatar
} from '@material-ui/core';

// Trevor Moore
// CST-451
// 12/9/2019
// This is my own work.

const useStyles = makeStyles(theme => ({
	card: {
		width: 700,
		marginBottom: "10px"
	},
	avatar: {
		backgroundColor: "rgb(147,112,219)"
	},
	text: {
		color: theme.text
	}
}));

// Home component for rendering the home page:
export default function Home() {
	const classes = useStyles();
	const [uploads, setUploads] = useState([]);
	const { get } = useRequest();
	const { authState } = useAuth();

	useEffect(() => {
		async function getUploads() {
			const response = await get(config.CONTENT_GET_ALL_CONTENT_GET, {
				token: authState.token
			});
			if (response.success) {
				setUploads(response.data);
			}
		}
		getUploads();
		return () => { };
	}, []);

	return (
		<Box
			display='flex'
			flexDirection='column'
			alignItems='center'
			justifyContent='center'
		>
			{uploads.map(content => (
				<Card key={content.id} className={classes.card}>
					<CardHeader
						avatar={
							<Avatar className={classes.avatar} alt="B" src={content.userProfilePicUri} />
						}
						action={
							<IconButton>
								<MoreVertIcon />
							</IconButton>
						}
						title={content.userName}
						subheader={content.datePostedUTC}
						className={classes.text}
					/>
					{content.mediaUri ? (
						<CardMedia
							className={classes.media}
						>
							{content.mediaType == 0 ? (
								<img src={content.mediaUri} alt="B" width="100%" />
							) : (
									<video width="100%" loop controls autoPlay>
										<source src={content.mediaUri} type="video/mp4" />
										<source src={content.mediaUri} type="video/webm" />
										<source src={content.mediaUri} type="video/ogg" />
										<p className={classes.text}>Your browser does not support our videos :(</p>
									</video>
								)}
						</CardMedia>) : (
							<></>
						)}
					<CardContent>
						<p className={classes.text}>{content.contentBody}</p>
					</CardContent>
					<CardActions disableSpacing>
						<IconButton aria-label="add to favorites">
							<FavoriteIcon />
						</IconButton>
						<IconButton aria-label="share">
							<ShareIcon />
						</IconButton>
					</CardActions>

				</Card>
			))}
		</Box>
	);
}
