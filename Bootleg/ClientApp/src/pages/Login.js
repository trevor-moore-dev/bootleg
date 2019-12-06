import React, { useState } from "react";
import {
	Typography,
	TextField,
	Box,
	Button,
	Grid,
	Card,
	CardContent,
	Divider,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import useRequest from "../hooks/useRequest";
import useAuth from "../hooks/useAuth";
import Avatar from "@material-ui/core/Avatar";
import CloseIcon from "@material-ui/icons/Close";
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
	const [emailValidationError, setEmailValidationError] = useState("");
	const [phone, setPhone] = useState("");
	const [phoneValidationError, setPhoneValidationError] = useState("");
	const [username, setUsername] = useState("");
	const [usernameValidationError, setUsernameValidationError] = useState("");
	const [password, setPassword] = useState("");
	const [passwordValidationError, setPasswordValidationError] = useState("");
	const [loginUsername, setLoginUsername] = useState("");
	const [loginUsernameValidationError, setLoginUsernameValidationError] = useState("");
	const [loginPassword, setLoginPassword] = useState("");
	const [loginPasswordValidationError, setLoginPasswordValidationError] = useState("");
	const [errors, setErrors] = useState([]);
	const [submitting, setSubmitting] = useState(false);
	const [failureOpen, setFailureOpen] = useState(false);
	const { post } = useRequest();
	const { login } = useAuth();

	const handleEmailChange = e => {
		setEmail(e.target.value);
		if (e.target.value) {
			setEmailValidationError("");
			setPhoneValidationError("");
		}
	};
	const handlePhoneChange = e => {
		setPhone(e.target.value);
		if (e.target.value) {
			setEmailValidationError("");
			setPhoneValidationError("");
		}
	};
	const handleUsernameChange = e => {
		setUsername(e.target.value);
		if (e.target.value) {
			setUsernameValidationError("");
		}
	};
	const handlePasswordChange = e => {
		setPassword(e.target.value);
		if (e.target.value) {
			setPasswordValidationError("");
		}
	};
	const handleLoginUsernameChange = e => {
		setLoginUsername(e.target.value);
		if (e.target.value) {
			setLoginUsernameValidationError("");
		}
	};
	const handleLoginPasswordChange = e => {
		setLoginPassword(e.target.value);
		if (e.target.value) {
			setLoginPasswordValidationError("");
		}
	};
	const handleFailureClose = () => {
		setFailureOpen(false);
	};

	const handleRegisterSubmit = async () => {
		setErrors([]);
		setSubmitting(true);
		let isValid = true;
		if (username === "") {
			setUsernameValidationError("The Username field is required.");
			isValid = false;
		}
		else if (username.length < 1 || username.length > 25) {
			setUsernameValidationError("The Username field must have a minimum of 1 character, and a max of 25.");
			isValid = false;
		}
		if (password === "") {
			setPasswordValidationError("The Password field is required.");
			isValid = false;
		}
		else if (password.length < 8 || password.length > 25) {
			setPasswordValidationError("The Password field must have a minimum of 8 characters, and a max of 25.");
			isValid = false;
		}
		if (phone === "" && email === "") {
			setEmailValidationError("The Email field OR Phone field is required.");
			setPhoneValidationError("The Email field OR Phone field is required.");
			isValid = false;
		}
		if (isValid) {
			const response = await post(config.AUTHENTICATION_REGISTER_USER_POST, {
				Data: {
					Email: email,
					Phone: phone,
					Username: username,
					Password: password
				}
			});
			if (response.success) {
				login(response.data[0]);
			}
			else {
				setErrors(response.errors);
				setFailureOpen(true);
			}
		}
		setSubmitting(false);
	};

	const handleLoginSubmit = async () => {
		setErrors([]);
		setSubmitting(true);
		let isValid = true;
		if (loginUsername === "") {
			setLoginUsernameValidationError("The Username field is required.");
			isValid = false;
		}
		else if (loginUsername.length < 1 || loginUsername.length > 25) {
			setLoginUsernameValidationError("The Username field must have a minimum of 1 character, and a max of 25.");
			isValid = false;
		}
		if (loginPassword === "") {
			setLoginPasswordValidationError("The Password field is required.");
			isValid = false;
		}
		else if (loginPassword.length < 8 || loginPassword.length > 25) {
			setLoginPasswordValidationError("The Password field must have a minimum of 8 characters, and a max of 25.");
			isValid = false;
		}
		if (isValid) {
			const response = await post(config.AUTHENTICATION_AUTHENTICATE_USER_POST, {
				Data: {
					Username: loginUsername,
					Password: loginPassword
				}
			});
			if (response.success) {
				login(response.data[0]);
			}
			else {
				setErrors(response.errors);
				setFailureOpen(true);
			}
		}
		setSubmitting(false);
	};

	const responseGoogle = async googleResponse => {
		if (googleResponse.tokenId) {
			let response = await post(config.GOOGLE_AUTH_CALLBACK_URL, {
				Data: {
					TokenId: googleResponse.tokenId
				}
			});
			if (response.success) {
				login(response.data[0]);
			}
			else {
				setErrors(response.errors);
				setFailureOpen(true);
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
								<TextField
									autoFocus
									label="Username or Email"
									className={classes.textField}
									value={loginUsername}
									onChange={handleLoginUsernameChange}
									margin="normal"
									variant="filled"
								/>
								<div style={{ color: "red", marginTop: "5px" }}>
									{loginUsernameValidationError}
								</div>
								<TextField
									label="Password"
									type="password"
									className={classes.textField}
									value={loginPassword}
									onChange={handleLoginPasswordChange}
									margin="normal"
									variant="filled"
								/>
								<div style={{ color: "red", marginTop: "5px" }}>
									{loginPasswordValidationError}
								</div>
								
								<Button
									color="primary"
									variant="contained"
									className={classes.submit}
									onClick={handleLoginSubmit}
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
								<TextField
									label="Email"
									type="email"
									className={classes.textField}
									value={email}
									onChange={handleEmailChange}
									margin="normal"
									variant="outlined"
								/>
								<div style={{ color: "red", marginTop: "5px" }}>
									{emailValidationError}
								</div>
								<TextField
									label="Phone"
									className={classes.textField}
									value={phone}
									onChange={handlePhoneChange}
									margin="normal"
									variant="outlined"
								/>
								<div style={{ color: "red", marginTop: "5px" }}>
									{phoneValidationError}
								</div>
								<TextField
									label="Username"
									className={classes.textField}
									value={username}
									onChange={handleUsernameChange}
									margin="normal"
									variant="outlined"
								/>
								<div style={{ color: "red", marginTop: "5px" }}>
									{usernameValidationError}
								</div>
								<TextField
									label="Password"
									type="password"
									className={classes.textField}
									value={password}
									onChange={handlePasswordChange}
									margin="normal"
									variant="outlined"
								/>
								<div style={{ color: "red", marginTop: "5px" }}>
									{passwordValidationError}
								</div>

								<Button
									color="primary"
									variant="contained"
									className={classes.submit}
									onClick={handleRegisterSubmit}
									disabled={submitting}
								>
									Sign Up
								</Button>

								<br />
								<Divider variant="middle" />
								<br />

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
			<Dialog
				onClose={handleFailureClose}
				open={failureOpen}
				fullWidth
				PaperProps={{ style: { maxWidth: 450 } }}
			>
				<DialogTitle align="center">
					<Avatar style={{ backgroundColor: "#ff0000" }}>
						<CloseIcon fontSize="large" />
					</Avatar>
					<div style={{ textAlign: "left !important" }}>
						Error(s) occurred:<br />
						{errors["Data.Username"] ? [errors["Data.Username"],<br />] : ""}
						{errors["Data.Password"] ? [errors["Data.Password"],<br />] : ""}
						{errors["Data.Email"] ? [errors["Data.Email"],<br />] : ""}
						{errors["Data.Phone"] ? [errors["Data.Phone"],<br />] : ""}
						{errors["*"] ? [errors["*"],<br />] : ""}
					</div>
				</DialogTitle>
				<DialogContent align="center"></DialogContent>
				<DialogActions>
					<Button onClick={handleFailureClose} variant="contained">
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}