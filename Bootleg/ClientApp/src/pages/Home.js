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
	Grid
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
	video: {
		outline: "none",
		width: "100%"
	},
	img: {
		width: "100%"
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
		overflow: "hidden",
		height: "105vh",
		marginTop: "-100px",
		paddingTop: "100px",
		position: "relative"
	},
	contentGrid: {
		[theme.breakpoints.down('sm')]: {
			width: "100%",
			maxWidth: "100%",
			flexBasis: "100%"
		},
		overflow: "scroll",
		overflowX: "hidden",
		'&::-webkit-scrollbar': {
			display: 'none'
		},
		height: "-moz-available",
		height: "-webkit-fill-available",
		height: "fill-available",
	},
	profileGrid: {
		display: 'none',
		[theme.breakpoints.up('md')]: {
			display: 'block',
		},
	},
	spaceGrid: {
		paddingTop: "24px!important",
		paddingBottom: "24px!important",
		paddingLeft: "12px!important",
		paddingRight: "12px!important",
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
		<Box className={classes.box}>
			<Grid className={classes.grid} container spacing={3}>
				<Grid item xs={8} className={`${classes.contentGrid} ${classes.spaceGrid}`}>
					{uploads.map(content => (
						<Card key={content.id} className={classes.card}>
							<CardHeader
								avatar={
									<Avatar className={classes.avatar} alt="B" src={content.userProfilePicUri} />
								}
								action={
									<IconButton color="inherit">
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
										<LazyLoad height={200}>
											<img src={content.mediaUri} alt="Content couldn't load :(" className={classes.img} />
										</LazyLoad>
									) : (
											<LazyLoad height={200}>
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
							<CardActions disableSpacing>
								<IconButton color="primary">
									<ThumbUpAltIcon />
								</IconButton>
								<IconButton color="primary">
									<ThumbDownAltIcon />
								</IconButton>
							</CardActions>
						</Card>
					))}
				</Grid>
				<Grid item xs={4} className={`${classes.profileGrid} ${classes.spaceGrid}`}>
					<Card className={classes.card}>
						<CardContent>
							<p className={classes.text}>afdasdf</p>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</Box>
	);
}
