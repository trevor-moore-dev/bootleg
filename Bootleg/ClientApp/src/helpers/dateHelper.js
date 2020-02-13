
// Trevor Moore
// CST-451
// 12/9/2019
// This is my own work.

// Function for formatting a plain text date (which could be in DateTime format) with the standard format of: MM/DD/YYY
export function formatDate(date) {
	// Create a new date with the passed in text:
	let time = new Date(date);
	// Return the standard format: MM/DD/YYY
	return time.getMonth() + 1 + "/" + time.getDate() + "/" + time.getFullYear();
}

// Function for formatting a plain text date (which could be in DateTime format) with the standard format of: MM/DD/YYY
export function formatDateWithTime(date) {
	// Create a new date with the passed in text:
	let time = new Date(date);
	// Get the hours and the minutes:
	let hours = time.getHours();
	let minutes = time.getMinutes();
	// Detemine am/pm:
	let ampm = hours >= 12 ? 'pm' : 'am';
	hours = hours % 12;
	// The hour '0' should be '12'
	hours = hours ? hours : 12;
	// Set the minutes so that they are displayed correctly:
	minutes = minutes < 10 ? '0' + minutes : minutes;
	// Combine hours, minutes, and ampm for formatted time:
	let formattedTime = hours + ':' + minutes + ' ' + ampm;
	// Return the standard format: MM/DD/YYY HH:MM am/pm
	return time.getMonth() + 1 + "/" + time.getDate() + "/" + time.getFullYear() + "  " + formattedTime;
}

// Function for getting the current ticks:
export function currentTicks() {
	// Create a new date:
	let time = new Date();
	// Return the ticks:
	return time.getTime().toString();
}