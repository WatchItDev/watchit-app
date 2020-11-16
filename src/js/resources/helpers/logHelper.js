/**
 * Created by gmena on 05-03-17.
 */


let Logger = ({
	ok: (message) => {
		//Logging OK
		console.log('%c' + message, 'color: green;');
		
	},
	log: (message) => { // Initial sett
		//Logging OK
		console.log(message); //local log
	},
	info: (message) => {
		//Logging INFO
		console.info('%c' + message, 'color: blue;');
	},
	warn: (message) => {
		//Logging INFO
		//local log
		console.warn('%c' + message, 'color: orange;');
	},
	error: (message) => {
		//local log
		console.error(message, message);
	}
	
});

//default export
export default Logger