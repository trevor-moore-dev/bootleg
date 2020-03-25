import React, { useState, useEffect } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import config from '../config.json';
import useRequest from '../hooks/useRequest';
import useAuth from "../hooks/useAuth";
import LazyLoad from 'react-lazyload';
import { formatDate } from "../helpers/dateHelper";
import { Link as RouterLink } from 'react-router-dom';
import {
	Box,
	IconButton,
	CardMedia,
	CardHeader,
	Card,
	CardActions,
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
export default function Home() {
	// Create our styles and such, and create our state:
	const classes = useStyles();
	const [uploads, setUploads] = useState([]);
	const { get } = useRequest();
	const { authState } = useAuth();

	// useEffect hook for getting all content that a user should have showing up on their feed:
	useEffect(() => {
		async function getUploads() {
			// Send post request to get all profiles
			const response = await get(config.CONTENT_GET_ALL_CONTENT_GET, {
				userId: authState.user.id
			});
			// On success set the data:
			if (response.success) {
				setUploads(response.data);
			}
		}
		getUploads();
		return () => { };
	}, []);

	// Return our markup:
	return (
		<Box className={classes.box}>
			<Grid className={classes.grid} container spacing={3}>
				<Grid item xs={8} className={`${classes.contentGrid} ${classes.spaceGrid}`}>
					{uploads && uploads.length > 0 ? uploads.map(content => (
						<Card key={content.id} className={classes.card}>
							<Link
								key={content.id}
								className={classes.link}
								component={RouterLink}
								to={`/account/${content.userId}`}>
								<CardHeader
									avatar={
										<LazyLoad>
											<Avatar className={classes.avatar} src={content.userProfilePicUri} />
										</LazyLoad>
									}
									title={content.userName}
									subheader={formatDate(content.datePostedUTC)}
									className={classes.text}
								/>
							</Link>
							<Link
								key={content.id}
								className={classes.link}
								component={RouterLink}
								to={`/post/${content.id}`}>
								{content.mediaUri ? (
									<CardMedia>
										{content.mediaType == 0 ? (
											<LazyLoad>
												<img src={content.mediaUri} alt="Image couldn't load or was deleted :(" className={classes.img} />
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
									</CardMedia>) : (
										<></>
									)}
								<CardContent>
									<p className={classes.text}>{content.contentBody}</p>
								</CardContent>
							</Link>
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
				<Grid item xs={4} className={`${classes.profileGrid} ${classes.spaceGrid}`}>
					<Card className={classes.card}>
						<CardHeader
							avatar={
								<LazyLoad>
									<Avatar className={classes.avatar} src={authState.user.profilePic} />
								</LazyLoad>
							}
							title={authState.user.email}
							className={classes.text}
						/>
						<CardContent>
							<p className={classes.text}>Hello There! :)</p>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</Box >
	);
}
