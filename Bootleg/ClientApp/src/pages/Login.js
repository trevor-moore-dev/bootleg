import React, { useEffect, useState } from "react";
import {
	Typography,
	TextField,
	Box,
	Button,
	Grid,
	Card,
	CardContent,
	Divider
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import useRequest from "../hooks/useRequest";
import useAuth from "../hooks/useAuth";
import { GoogleLogin } from "react-google-login";
import config from "../config.json";

const useStyles = makeStyles(theme => ({
	form: {
		marginTop: theme.spacing(2)
	},
	submit: {
		marginTop: theme.spacing(2)
	},
	formControl: {
		marginTop: theme.spacing(2)
	}
}));

export default function Login() {
	const classes = useStyles();
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState([]);
	const [submitting, setSubmitting] = useState(false);
	const { post } = useRequest();
	const { login } = useAuth();

	useEffect(() => {
		//async function test() {
			//let response = await get(config.TEST_URL, { data: id });
			//if (response.success) {
				//setUser(response.data[0]);
			//} else {
				//setErrors(response.errors);
			//}
		//}
		//test();
		return () => { };
	}, []);

	const handleEmailChange = e => {
		setEmail(e.target.value);
	};
	const handlePhoneChange = e => {
		setPhone(e.target.value);
	};
	const handleUsernameChange = e => {
		setUsername(e.target.value);
	};
	const handlePasswordChange = e => {
		setPassword(e.target.value);
	};

	const handleSubmit = async () => {
		setErrors([]);
		setSubmitting(true);
		const response = await post(config.ADD_EMAIL_POST_URL, {
			//UserId: id,
			Data: {
				Email: email,
				//Name: name,
				//Children: children,
				//Type: parseInt(participantType, 10),
				//DateEntered: new Date()
			}
		});
		if (response.success) {
			//setSuccessOpen(true);
			setEmail("");
			//setName("");
			//setChildren(0);
			//setParticipantType("1");
		} else {
			setErrors(response.errors);
			//setFailureOpen(true);
		}
		setSubmitting(false);
	};

	const responseGoogle = async googleResponse => {
		if (googleResponse.tokenId) {
			let response = await post(config.GOOGLE_AUTH_CALLBACK_URL, {
				tokenId: googleResponse.tokenId
			});
			if (response.success) {
				login(response.data[0]);
			}
		}
	};

	return (
		<Box
			display="flex"
			alignItems="center"
			justifyContent="center"
			flexDirection="column"
		>
			<Grid container spacing={3}>
				<Grid item xs={12} sm={6}>
					<Card className={classes.card}>
						<CardContent>
							<Box display="flex" flexDirection="column" className={classes.form}>
								<Typography variant="h6" color="primary" align="center">Login</Typography>
								{Boolean(errors["*"]) && (
									<Typography color="error">{errors["*"]}</Typography>
								)}
								<TextField
									label="Username or Email"
									className={classes.textField}
									value={username}
									onChange={handleUsernameChange}
									margin="normal"
									variant="filled"
									error={Boolean(errors["Data.Username"])}
									helperText={errors["Data.Username"]}
								/>
								<TextField
									label="Password"
									type="password"
									className={classes.textField}
									value={password}
									onChange={handlePasswordChange}
									margin="normal"
									variant="filled"
									error={Boolean(errors["Data.Password"])}
									helperText={errors["Data.Password"]}
								/>
								
								<Button
									color="primary"
									variant="contained"
									className={classes.submit}
									onClick={handleSubmit}
									disabled={submitting}
								>
									Login
								</Button>
							</Box>
						</CardContent>
					</Card>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Card className={classes.card}>
						<CardContent>
							<Box display="flex" flexDirection="column" className={classes.form}>
								<Typography variant="h6" color="primary" align="center">Sign Up</Typography>
								{Boolean(errors["*"]) && (
									<Typography color="error">{errors["*"]}</Typography>
								)}
								<TextField
									autoFocus
									label="Email"
									type="email"
									className={classes.textField}
									value={email}
									onChange={handleEmailChange}
									margin="normal"
									variant="outlined"
									error={Boolean(errors["Data.Email"])}
									helperText={errors["Data.Email"]}
								/>
								<TextField
									label="Phone"
									className={classes.textField}
									value={phone}
									onChange={handlePhoneChange}
									margin="normal"
									variant="outlined"
									error={Boolean(errors["Data.Phone"])}
									helperText={errors["Data.Phone"]}
								/>
								<TextField
									label="Username"
									className={classes.textField}
									value={username}
									onChange={handleUsernameChange}
									margin="normal"
									variant="outlined"
									error={Boolean(errors["Data.Username"])}
									helperText={errors["Data.Username"]}
								/>
								<TextField
									label="Password"
									type="password"
									className={classes.textField}
									value={password}
									onChange={handlePasswordChange}
									margin="normal"
									variant="outlined"
									error={Boolean(errors["Data.Password"])}
									helperText={errors["Data.Password"]}
								/>

								<Button
									color="primary"
									variant="contained"
									className={classes.submit}
									onClick={handleSubmit}
									disabled={submitting}
								>
									Sign Up
								</Button>
								<br />
								<Divider variant="middle" />
								<br/>
								<div align="center">
									<GoogleLogin
									  clientId={config.GOOGLE_CLIENT_ID}
									  buttonText="Google Login"
									  onSuccess={responseGoogle}
									  onFailure={responseGoogle}
									/>
								</div>
							</Box>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</Box>
	);
}