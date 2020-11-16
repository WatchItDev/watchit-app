const ip = require('ip');
const server = require(`./server.js`)

module.exports = class Cast {
	constructor() {
		this.dnla = require('dlnacasts2')()
		this.events = {device: null, status: null}
		
		this.subs = []
		this.players = []
		this.player = null;
		this.server = null;
		
		this.dnla.on('update', (player) => {
			this.players = this.dnla.players
			this.player = this.players[0]
			this._loopEvent('device', player)
		})
		
		this.dnla.on('status', (status) => {
			this._loopEvent('status', status)
		})
	}
	
	createServer() {
		try {
			// Create server
			if (this.server) return;
			this.server = server(this.localIp)
		} catch (e) {
			console.log('Creating server error');
			console.log(e);
		}
		
		return this;
	}
	
	requestUpdate() {
		console.log('Request dnla');
		this.dnla.update();
		return this;
	}
	
	stop() {
		// Stop server
		if (this.server) this.server.close();
		if (this.player && this.player.client)
			this.player.stop();
		// Clear attrs
		this.subs = [];
		this.server = null;
	}
	
	on(event, fn) {
		//Events dict
		if (event in this.events) {
			this.events[event] = fn
		}
		
		return this;
	}
	
	_loopEvent(e, ...params) {
		if (e in this.events && this.events[e]) {
			this.events[e](...params)
		}
	}
	
	get localIp() {
		return ip.address()
	}
	
	setPlayer(i) {
		this.player = this.players[i];
		console.log(this.player.name, ' set');
	}
	
	setSub(sub) {
		this.subs = [this.sanitizeSub(sub)]
	}
	
	sanitizeSub(sub) {
		return `http://${this.localIp}:9990${sub.replace('.vtt', '.srt')}`
	}
	
	addSub(sub) {
		this.subs.push(this.sanitizeSub(sub))
	}
	
	play(title, stream) {
		// Use local lan address
		// Try start stream
		this.player.play(stream.replace('127.0.0.1', this.localIp), {
			title: title, type: 'video/mp4',
			dlnaFeatures: "DLNA.ORG_OP=01;DLNA.ORG_FLAGS=01100000000000000000000000000000", // this enables seeking in some dlna devices
			seek: 1, // start by seeking to this offset
			subtitles: this.subs, // subtitle track 1,
			autoSubtitles: true // enable first track if you provide subs
		})
	}
}


