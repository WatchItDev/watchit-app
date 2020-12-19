/**
 * Handle global settings
 * **/
import util from 'js/resources/helpers/utilHelper'

const Settings = {};
let {width, height, chunkSize, chunkHeight} = util.calcScreenSize()

/////////////////////
//Resource Settings//
/////////////////////
//Avoid bad indexing
//WatchIt API
Settings.defaults = {
	width: width,
	height: height,
	chunkSize: chunkSize,
	chunkHeight: chunkHeight,
	limit: chunkSize * 5
};

//Subs conf
Settings.subs = {
	hash: {'spanish': 'es', 'english': 'en'},
	get revHash() {
		let v = Object.values(this.hash)
		let k = Object.keys(this.hash)
		return v.reduce((o, i, index) => {
			o[i] = k[index]
			return o
		}, {})
	},
	get available() {
		return Object.keys(this.hash)
	}
};

//Resolution conf
Settings.resolutions = {
	available: [
		'720p', '1080p', '2160p'
	]
};

//Default user settings
Settings.user = {
	timezone: 'America/Managua',
	max_old_chats: 50
};

//Errors codes
Settings.errorCodes = {
	ERROR_IMAGE_BROKEN_LINK: 300,
	ERROR_BAD_TORRENT: 301,
	ERROR_MOVIE_PLAYER: 302,
	ERROR_BAD_SUBTITLE: 303
};

export default Settings;

