
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