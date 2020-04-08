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
import Carousel, { Dots } from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';
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
	}
}));

// Home component for rendering the home page:
export default function Home() {
	// Create our styles and such, and create our state:
	const classes = useStyles();
	const [uploads, setUploads] = useState([]);
	const [followings, setFollowings] = useState([]);
	const [likes, setLikes] = useState([]);
	const [dislikes, setDislikes] = useState([]);
	const [originalLikes, setOriginalLikes] = useState([]);
	const [originalDislikes, setOriginalDislikes] = useState([]);
	const { get, post } = useRequest();
	const { authState } = useAuth();

	// useEffect hook for getting all content that a user should have showing up on their feed:
	useEffect(() => {
		async function getUploads() {
			// Send post request to get all profiles:
			const response = await get(config.CONTENT_GET_ALL_CONTENT_GET, {
				userId: authState.user.id
			});
			// On success set the data:
			if (response.success) {
				setUploads(response.data);
			}
		}
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
		async function getUserLikesAndDislikes() {
			// Send get request to get the user:
			const response = await get(config.USER_GET_USER_GET, {
				userId: authState.user.id
			});
			// On success set the data:
			if (response.success) {
				setOriginalLikes(response.data.likedContentIds || []);
				setOriginalDislikes(response.data.dislikedContentIds || []);
				setLikes(response.data.likedContentIds || []);
				setDislikes(response.data.dislikedContentIds || []);
			}
		}
		getUploads();
		getUserFollowings();
		getUserLikesAndDislikes();
		return () => { };
	}, []);

	// Method for updating uploads active likes:
	const setActiveLike = (id, active) => {
		let newUploads = uploads;
		let objIndex = newUploads.findIndex(obj => obj.id == id);
		newUploads[objIndex].activeLike = active;
		setUploads(newUploads);
	};

	// Method for updating uploads active dislikes:
	const setActiveDislike = (id, active) => {
		let newUploads = uploads;
		let objIndex = newUploads.findIndex(obj => obj.id == id);
		newUploads[objIndex].activeDisike = active;
		setUploads(newUploads);
	};

	// Methods for liking, unliking, disliking, and undisliking posts:
	const likePost = async (contentId) => {
		await post(config.CONTENT_LIKE_POST_POST, {
			Id: authState.user.id,
			Data: contentId
		});
		let newLikes = [...likes, contentId];
		setLikes(newLikes);
		setActiveLike(contentId, true);
	};
	const unlikePost = async (contentId) => {
		await post(config.CONTENT_UNLIKE_POST_POST, {
			Id: authState.user.id,
			Data: contentId
		});
		let newLikes = likes.filter(id => id !== contentId);
		setLikes(newLikes);
		setActiveLike(contentId, false);
	};
	const dislikePost = async (contentId) => {
		await post(config.CONTENT_DISLIKE_POST_POST, {
			Id: authState.user.id,
			Data: contentId
		});
		let newDislikes = [...dislikes, contentId];
		setDislikes(newDislikes);
		setActiveDislike(contentId, true);
	};
	const undislikePost = async (contentId) => {
		await post(config.CONTENT_UNDISLIKE_POST_POST, {
			Id: authState.user.id,
			Data: contentId
		});
		let newDislikes = dislikes.filter(id => id !== contentId);
		setDislikes(newDislikes);
		setActiveDislike(contentId, false);
	};

	// Return our markup:
	return (
		<Box className={classes.box}>
			<Grid className={classes.grid} container spacing={3}>
				<Grid item xs={8} className={`${classes.contentGrid} ${classes.spaceGrid}`}>
					{uploads && uploads.length > 0 ? uploads.map(content => (
						<Card key={content.id} className={classes.card}>
							<Link
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
								className={classes.link}
								component={RouterLink}
								to={`/post/${content.id}`}>
								{content.mediaUri &&
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
									</CardMedia>}
								<CardContent>
									<p className={classes.text}>{content.contentBody}</p>
								</CardContent>
							</Link>
							<CardActions disableSpacing>
								<IconButton color={likes.includes(content.id) ? "primary" : ""} className={likes.includes(content.id) ? "" : classes.iconButtons} onClick={likes.includes(content.id) ? () => unlikePost(content.id) : () => likePost(content.id)}>
									<ThumbUpAltIcon />
									<div className={classes.stats}>
										{originalLikes.includes(content.id) ?
											(likes.includes(content.id) ? content.likes : (content.likes - 1)) :
											(likes.includes(content.id) ? (content.likes + 1) : content.likes)}
									</div>
								</IconButton>
								<IconButton color={dislikes.includes(content.id) ? "primary" : ""} className={dislikes.includes(content.id) ? "" : classes.iconButtons} onClick={dislikes.includes(content.id) ? () => undislikePost(content.id) : () => dislikePost(content.id)}>
									<ThumbDownAltIcon />
									<div className={classes.stats}>
										{originalDislikes.includes(content.id) ?
											(dislikes.includes(content.id) ? content.dislikes : (content.dislikes - 1)) :
											(dislikes.includes(content.id) ? (content.dislikes + 1) : content.dislikes)}
									</div>
								</IconButton>
								<Link
									className={classes.link}
									component={RouterLink}
									to={`/post/${content.id}`}>
									<IconButton className={classes.iconButtons}>
										<ChatBubbleIcon />
									</IconButton>
								</Link>
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
							title={'Welcome, ' + authState.user.email}
							className={classes.text}
						/>
						<CardContent>
							<p className={classes.text}>See what's new...</p>
							<Carousel
								slidesPerPage='5'
								className={`${classes.sectionMobile} ${classes.carousel}`}
								infinite
							>
								{followings && followings.length > 0 && followings.map(user =>
									<div key={user.id} className={`${classes.profileThing} ${classes.lightText}`}>
										<Avatar className={classes.mobileAvatar} src={user.profilePicUri} />
										<div className={classes.ellipsis}>{user.username}</div>
									</div>)}
							</Carousel>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</Box >
	);
}
