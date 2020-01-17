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
import useRequest from "../hooks/useRequest";
import useAuth from "../hooks/useAuth";
import Avatar from "@material-ui/core/Avatar";
import CloseIcon from "@material-ui/icons/Close";
import { GoogleLogin } from "react-google-login";
import config from "../config.json";

// Trevor Moore
// CST-451
// 12/9/2019
// This is my own work.

// Login component for rendering our login and register markup:
export default function Login() {
	// Create our state properties with the useState Hooks API:
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
	// Function for handling when the email input is changed:
	const handleEmailChange = e => {
		// Update the state to the target value:
		setEmail(e.target.value);
		// If the target has a value, set the validation to be blank:
		if (e.target.value) {
			setEmailValidationError("");
			setPhoneValidationError("");
		}
	};
	// Function for handling when the phone input is changed:
	const handlePhoneChange = e => {
		// Update the state to the target value:
		setPhone(e.target.value);
		// If the target has a value, set the validation to be blank:
		if (e.target.value) {
			setEmailValidationError("");
			setPhoneValidationError("");
		}
	};
	// Function for handling when the username input is changed:
	const handleUsernameChange = e => {
		// Update the state to the target value:
		setUsername(e.target.value);
		// If the target has a value, set the validation to be blank:
		if (e.target.value) {
			setUsernameValidationError("");
		}
	};
	// Function for handling when the password input is changed:
	const handlePasswordChange = e => {
		// Update the state to the target value:
		setPassword(e.target.value);
		// If the target has a value, set the validation to be blank:
		if (e.target.value) {
			setPasswordValidationError("");
		}
	};
	// Function for handling when the login username input is changed:
	const handleLoginUsernameChange = e => {
		// Update the state to the target value:
		setLoginUsername(e.target.value);
		// If the target has a value, set the validation to be blank:
		if (e.target.value) {
			setLoginUsernameValidationError("");
		}
	};
	// Function for handling when the login password input is changed:
	const handleLoginPasswordChange = e => {
		// Update the state to the target value:
		setLoginPassword(e.target.value);
		// If the target has a value, set the validation to be blank:
		if (e.target.value) {
			setLoginPasswordValidationError("");
		}
	};
	// Function for handling when the failure popup is closed:
	const handleFailureClose = () => {
		// Set failureOpen state to be false:
		setFailureOpen(false);
	};
	// Function for handling when the user submits the register form:
	const handleRegisterSubmit = async () => {
		// Set the errors to be a blank array for now:
		setErrors([]);
		// Set submitting state to be true:
		setSubmitting(true);
		// Initialize isValid to be true:
		let isValid = true;
		// If username is blank set username validation and isValid to false:
		if (username === "") {
			setUsernameValidationError("The Username field is required.");
			isValid = false;
		}
		// Else If username is not valid length set username validation and isValid to false:
		else if (username.length < 1 || username.length > 25) {
			setUsernameValidationError("The Username field must have a minimum of 1 character, and a max of 25.");
			isValid = false;
		}
		// If password is blank set password validation and isValid to false:
		if (password === "") {
			setPasswordValidationError("The Password field is required.");
			isValid = false;
		}
		// Else If password is not valid length set password validation and isValid to false:
		else if (password.length < 8 || password.length > 25) {
			setPasswordValidationError("The Password field must have a minimum of 8 characters, and a max of 25.");
			isValid = false;
		}
		// If phone and email is blank set phone and email validation and isValid to false:
		if (phone === "" && email === "") {
			setEmailValidationError("The Email field OR Phone field is required.");
			setPhoneValidationError("The Email field OR Phone field is required.");
			isValid = false;
		}
		// If isValid is true:
		if (isValid) {
			// Send post request to AUTHENTICATION_REGISTER_USER_POST endpoint and await response:
			const response = await post(config.AUTHENTICATION_REGISTER_USER_POST, {
				Data: {
					Email: email ? email : null,
					Phone: phone ? phone : null,
					Username: username,
					Password: password
				}
			});
			// If Request was successful:
			if (response.success) {
				// Dispatch the login:
				login(response.data[0]);
			}
			// Else:
			else {
				// Set the response errors and set failureOpen to true:
				setErrors(response.errors);
				setFailureOpen(true);
			}
		}
		// Set submitting to false:
		setSubmitting(false);
	};
	// Function for handling when the user submits the login form:
	const handleLoginSubmit = async () => {
		// Set the errors to be a blank array for now:
		setErrors([]);
		// Set submitting state to be true:
		setSubmitting(true);
		// Initialize isValid to be true:
		let isValid = true;
		// If username is blank set username validation and isValid to false:
		if (loginUsername === "") {
			setLoginUsernameValidationError("The Username field is required.");
			isValid = false;
		}
		// Else If username is not valid length set username validation and isValid to false:
		else if (loginUsername.length < 1 || loginUsername.length > 25) {
			setLoginUsernameValidationError("The Username field must have a minimum of 1 character, and a max of 25.");
			isValid = false;
		}
		// If password is blank set password validation and isValid to false:
		if (loginPassword === "") {
			setLoginPasswordValidationError("The Password field is required.");
			isValid = false;
		}
		// Else If password is not valid length set password validation and isValid to false:
		else if (loginPassword.length < 8 || loginPassword.length > 25) {
			setLoginPasswordValidationError("The Password field must have a minimum of 8 characters, and a max of 25.");
			isValid = false;
		}
		// If isValid is true:
		if (isValid) {
			// Send post request to AUTHENTICATION_AUTHENTICATE_USER_POST endpoint and await response:
			const response = await post(config.AUTHENTICATION_AUTHENTICATE_USER_POST, {
				Data: {
					Username: loginUsername,
					Password: loginPassword
				}
			});
			// If Request was successful:
			if (response.success) {
				// Dispatch the login:
				login(response.data[0]);
			}
			// Else:
			else {
				// Set the response errors and set failureOpen to true:
				setErrors(response.errors);
				setFailureOpen(true);
			}
		}
		// Set submitting to false:
		setSubmitting(false);
	};
	// Callback function which will execute after Google OAuth responds with a token:
	const responseGoogle = async googleResponse => {
		// If the google resposne has a token value:
		if (googleResponse.tokenId) {
			// Send post request to GOOGLE_AUTH_CALLBACK_URL endpoint and await response:
			let response = await post(config.GOOGLE_AUTH_CALLBACK_URL, {
				Data: {
					TokenId: googleResponse.tokenId
				}
			});
			// If Request was successful:
			if (response.success) {
				// Dispatch the login:
				login(response.data[0]);
			}
			// Else:
			else {
				// Set the response errors and set failureOpen to true:
				setErrors(response.errors);
				setFailureOpen(true);
			}
		}
	};
	// Render the login and register markup:
	return (
		<Box
			display="flex"
			alignItems="center"
			justifyContent="center"
			flexDirection="column"
		>
			<Grid container spacing={3}>
				<Grid item xs={12} sm={6}>
					<Card>
						<CardContent>
							<Box display="flex" flexDirection="column">
								<Typography variant="h6" align="center">Login</Typography>
								<TextField
									autoFocus
									label="Username or Email"
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
									value={loginPassword}
									onChange={handleLoginPasswordChange}
									margin="normal"
									variant="filled"
								/>
								<div style={{ color: "red", marginTop: "5px" }}>
									{loginPasswordValidationError}
								</div>

								<Button
									variant="contained"
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
					<Card>
						<CardContent>
							<Box display="flex" flexDirection="column">
								<Typography variant="h6" align="center">Sign Up</Typography>
								<TextField
									label="Email"
									type="email"
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
									value={password}
									onChange={handlePasswordChange}
									margin="normal"
									variant="outlined"
								/>
								<div style={{ color: "red", marginTop: "5px" }}>
									{passwordValidationError}
								</div>

								<Button
									variant="contained"
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
						{errors["Data.Username"] ? [errors["Data.Username"], <br />] : ""}
						{errors["Data.Password"] ? [errors["Data.Password"], <br />] : ""}
						{errors["Data.Email"] ? [errors["Data.Email"], <br />] : ""}
						{errors["Data.Phone"] ? [errors["Data.Phone"], <br />] : ""}
						{errors["*"] ? [errors["*"], <br />] : ""}
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