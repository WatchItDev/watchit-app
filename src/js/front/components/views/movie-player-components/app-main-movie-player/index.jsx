import Plyr from 'plyr';
import React from 'react'
import PropTypes from 'prop-types'
import setting from 'js/settings'
import logHelper from 'js/resources/helpers/logHelper'
import AppMoviesPlayerShare from 'js/front/components/views/movie-player-components/app-main-movie-player-share'
import AppMoviesPlayerVideo from 'js/front/components/views/movie-player-components/app-main-movie-player-video'

export default class AppMoviesPlayer extends React.Component {
	constructor(props) {
		super(props);
		
		this.streamer = window.Streamer
		this.cast = window.Cast
		this.subs = {};
		this.v = null;
		
		//Initial State
		this.state = {
			canPlay: false, flix: null, url: null,
			devices: this.players || []
		}
	}
	
	
	shouldComponentUpdate(nextProps, nextState, nextContext) {
		return nextState.canPlay
	}
	
	get players() {
		return this.cast.players.map((d, i) => {
			return d.name
		})
	}
	
	static get defaultProps() {
		return {
			subs: {},
			subSelected: 'spanish'
		}
	}
	
	static get propTypes() {
		return {
			movie: PropTypes.object.isRequired
		}
	}
	
	onSelectDevice = (index) => {
		this.cast.setPlayer(index);
		this.cast.play(this.props.movie.title, this.state.url);
		this.player.pause();
	}
	
	get currentLang() {
		return this.player.language &&
			setting.subs.revHash[this.player.language]
	}
	
	get currentSub() {
		return this.subs[this.currentLang]
	}
	
	get srtSub() {
		return this.currentSub &&
			this.currentSub.replace('.vtt', '.srt')
	}
	
	* interCues(video) {
		for (const track of video.textTracks) {
			if (track.label === this.currentLang) {
				for (const cue of track.cues)
					yield cue
				break;
			}
		}
	}
	
	// syncSubs() {
	// 	console.log('y');
	// 	for (const cue of this.interCues(this.v.video)) {
	// 		let cTime = this.player.currentTime;
	// 		let sTime = cue.startTime;
	//
	// 		if (sTime > cTime) {
	// 			let diff = cTime - sTime;
	// 			return diff < 0 ? this.removeOffset(diff * -1) :
	// 				this.addOffset(diff)
	// 		}
	// 	}
	// }
	
	addOffset(offset) {
		if (!this.currentSub || !this.v) return;
		window.Sub.reSync(this.srtSub, offset * 1000).then(() => {
			for (const cue of this.interCues(this.v.video)) {
				cue.startTime += offset || 0.5;
				cue.endTime += offset || 0.5;
			}
		})
	}
	
	removeOffset(offset) {
		if (!this.currentSub || !this.v) return;
		window.Sub.reSync(this.srtSub, (offset * -1) * 1000).then(() => {
			for (const cue of this.interCues(this.v.video)) {
				cue.startTime -= offset || 0.5;
				cue.endTime -= offset || 0.5;
			}
		})
	}
	
	componentDidMount() {
		//Cast init
		this.cast.createServer(
			// Create asset server
		).requestUpdate().on('status', (status) => {
			console.log('Status:', status);
		}).on('device', () => {
			console.log('New device');
			this.setState({devices: this.players})
		});
		
		// Prepare player
		let selectedSub = this.props.subSelected && {
			language: setting.subs.hash[this.props.subSelected]
		};
		
		// Init player
		this.player = new Plyr(this.v.video, {
			autoplay: true, quality: false,
			settings: ['captions', 'speed'],
			controls: [
				'play-large', // The large play button in the center
				'restart', // Restart playback
				'rewind', // Rewind by the seek time (default 10 seconds)
				'play', // Play/pause playback
				'fast-forward', // Fast forward by the seek time (default 10 seconds)
				'progress', // The progress bar and scrubber for playback and buffering
				'current-time', // The current time of playback
				'duration', // The full duration of the media
				'mute', // Toggle mute
				'volume', // Volume control
				'captions', // Toggle captions
				'settings', // Settings menu
				'fullscreen', // Toggle fullscreen
			],
			captions: {
				...{active: true, update: true},
				...selectedSub
			},
		})
		
		//On player change subtitles
		this.player.on('languagechange', () => {
			if (!this.currentSub) return;
			this.cast.setSub(this.currentSub)
		})
		
		// On ready to play
		this.v.video.addEventListener('canplay', () => {
			logHelper.ok('PLAYING MOVIE ON SERVER: ' + this.state.url);
			this.setState({canPlay: true});
			//Handle ready
			if (this.props.onCanPlay) {
				this.props.onCanPlay(
					this.state.url,
					this.state.flix
				);
			}
		})
		
		// On error
		this.v.video.addEventListener('error', (e) => {
			logHelper.error(`ERROR WHILE PLAYING MOVIE: ${JSON.stringify(e)}`);
		})
		
		//When player load
		this.v.video.addEventListener('loadedmetadata', () => {
			logHelper.info('PLAYER METADATA LOADED');
			
			// Convert to vtt
			for (let subtitle of Object.keys(this.props.subs)) {
				if (!setting.subs.available.includes(subtitle))
					continue;
				
				// Transform subs
				window.Sub.urlSrt2VttFile(
					this.props.subs[subtitle].link
				).then(({vtt, raw}) => {
					// If selected sub match
					logHelper.info('ADDING ' + subtitle.toUpperCase() + ' SUBTITLE: ' + vtt);
					let _elem = document.createElement('track');
					let selectedSub = Object.is(subtitle, this.props.subSelected)
					if (selectedSub) this.cast.setSub(raw);
					this.subs[subtitle] = raw;
					
					// Add captions
					_elem.src = vtt;
					_elem.kind = "captions";
					_elem.label = subtitle;
					_elem.mode = 'showing';
					_elem.srclang = setting.subs.hash[subtitle];
					_elem.default = selectedSub;
					this.player.media.appendChild(_elem);
				}).catch((e) => {
					logHelper.error(`ERROR PARSING SUBS: ${JSON.stringify(e)}`);
				})
			}
		});
		
		window.addEventListener("keyup", (e) => {
			let keyCode = e.which || e.keyCode;
			if (Object.is(keyCode, 71)) this.addOffset(0.5); //G
			if (Object.is(keyCode, 72)) this.removeOffset(0.5); //H
			//if (Object.is(keyCode, 83)) this.syncSubs();
		});
		
		//Start streamer
		logHelper.ok('STREAMING MOVIE: ' + this.props.movie.title.toUpperCase());
		this.streamer.playTorrent(
			`${window.env.ROOT_URI_TORRENT}${this.props.movie.torrent}`,
			this.onReady, this.onProgress, this.onError
		);
		
	}
	
	componentDidCatch(error, info) {
		console.dir("Component Did Catch Error");
		console.log(error);
		console.log(info);
	}
	
	// destroy player on unmount
	componentWillUnmount() {
		logHelper.warn('STREAMING STOPPED BY USER');
		this.streamer.stopTorrent();
		this.cast.stop();
	}
	
	onReady = (url, flix) => {
		logHelper.info('READY TO PLAY MOVIE: ' + url);
		this.setState({url: url, flix: flix});
		this.forceUpdate(() => {
			this.props.onReady &&
			this.props.onReady(url, flix);
		})
	}
	
	onProgress = (flix, percent, state) => {
		//Handle progress
		if (this.props.onProgress) {
			this.props.onProgress(
				parseInt(percent), state, flix
			);
		}
	}
	
	onError = (e) => {
		//Handle error
		logHelper.error(`ERROR WHILE STREAMING: ${JSON.stringify(e)}`);
		this.props.onError && this.props.onError(e);
	}
	
	getVideoRef = (ref) => {
		this.v = ref
	}
	
	render() {
		return <div className={this.state.canPlay && "left relative full-height full-width" || "invisible"}>
			<AppMoviesPlayerShare devices={this.state.devices} onChange={this.onSelectDevice}/>
			<AppMoviesPlayerVideo src={this.state.url} ref={this.getVideoRef}/>
		</div>
	}
}
