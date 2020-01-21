import React, { useState, useEffect } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import config from '../config.json';
import useRequest from '../hooks/useRequest';
import {
	Typography,
	Box,
	Button,
	Card,
	CardContent,
} from '@material-ui/core';

// Trevor Moore
// CST-451
// 12/9/2019
// This is my own work.

const useStyles = makeStyles(theme => ({
	image: {
		width: '100%'
	}
}));

// Home component for rendering the home page:
export default function Home() {
	const classes = useStyles();
	const [uploads, setUploads] = useState([]);
	const { get, post } = useRequest();

	useEffect(() => {
		async function getUploads() {
			let response = await get(config.CONTENT_GET_ALL_CONTENT_GET, {});
			if (response.success) {
				setUploads(
					response.data.map(e => {
						return e;
					})
				);
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
			{uploads.map(uri => (
				<Card key={uri}>
					<CardContent>
						<Box display='flex' flexDirection='column'>
							<a href={uri} target='_blank'><img src={uri} alt='images' className={classes.image} /></a><br />

							{/**<video width='320' height='240' loop controls autoplay>
								  <source src={uri} type='video/mp4' />
									  <source src={uri} type='video/webm' />
									  <source src={uri} type='video/ogg' />
										  Your browser does not support the video tag.
							</video>**/}
						</Box>
					</CardContent>
				</Card>
			))}
		</Box>
	);
}
