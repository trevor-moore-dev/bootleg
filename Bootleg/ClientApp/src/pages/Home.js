import React, { useState, useEffect } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import useRequest from '../hooks/useRequest';
import config from '../config.json';
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
	const { get, post } = useRequest();
	const brand = 'Hello! This is bootleg.';
	const [file, setFile] = useState({});
	const [uploads, setUploads] = useState([]);

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

	const handleFileChange = e => {
		setFile(e.target.files[0]);
	};

	// Function for handling when the user submits the register form:
	const uploadFile = async () => {

		//const response = await post(config.CONTENT_UPLOAD_CONTENT_POST, {
		//Data: file
		//});
		let form = new FormData();

		form.append('file', file);

		let response = await post(config.CONTENT_UPLOAD_CONTENT_POST, form)
			.catch((ex) => {
				console.error(ex);
			});
		/**
		await Axios.post(config.CONTENT_UPLOAD_CONTENT_POST, formData)
			.then(res => {
				response = res.data;
			})
			// Catch any errors and format them:
			.catch(error => {
				alert(error);
			});
			**/
		// If Request was successful:
		if (response.success) {
			alert('success :)');
		}


	};


	return (
		<Box
			display='flex'
			flexDirection='column'
			alignItems='center'
			justifyContent='center'
		>
			<Typography variant='h4' gutterBottom>
				{brand}
			</Typography>
			<Card>
				<CardContent>
					<Box display='flex' flexDirection='column'>
						<input type='file' onChange={handleFileChange} />
						<Button
							variant='contained'
							onClick={uploadFile}
						>
							Upload
					  	</Button>
					</Box>
				</CardContent>
			</Card>
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
