import Plyr from 'plyr';
import React from 'react'

import PropTypes from 'prop-types'
import setting from 'core/settings'
import AppMoviesPlayerShare from 'components/app-movie-player-share'
import AppMoviesPlayerVideo from 'components/app-movie-player-video'
import gatewayHelper from "core/resources/helpers/gatewayHelper";
import resourceHelper from "core/resources/helpers/resourceHelper";

const log = window.require("electron-log");
const subs = window.bridge.Subs
const cast =  window.bridge.DLNA

export default class AppMoviesPlayer extends React.Component {
    constructor(props) {
        super(props);

        this.subs = {};
        this.v = null;

        //Initial State
        this.state = {
            url: null,
            devices: this.players || []
        }
    }


    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return nextProps.canPlay || nextState.url;
    }

    get players() {
        return cast.players.map((d, i) => {
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
            movie: PropTypes.object.isRequired,
            canPlay: PropTypes.bool.isRequired
        }
    }

    onSelectDevice = (index) => {
        cast.setPlayer(index);
        cast.play(this.props.movie.title, this.state.url);
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
        subs.reSync(this.srtSub, offset * 1000).then(() => {
            for (const cue of this.interCues(this.v.video)) {
                cue.startTime += offset || 0.5;
                cue.endTime += offset || 0.5;
            }
        })
    }

    removeOffset(offset) {
        if (!this.currentSub || !this.v) return;
        subs.reSync(this.srtSub, (offset * -1) * 1000).then(() => {
            for (const cue of this.interCues(this.v.video)) {
                cue.startTime -= offset || 0.5;
                cue.endTime -= offset || 0.5;
            }
        })
    }

    async componentDidMount() {
        //Cast init
        cast.createServer(
            // Create asset server
        ).requestUpdate().on('status', (status) => {
            log.info('Status:' + status);
        }).on('device', () => {
            log.info('New device');
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
            cast.setSub(this.currentSub)
        })

        // On ready to play
        this.v.video.addEventListener('canplay', () => {
            log.info('PLAYING MOVIE ON SERVER: ' + this.state.url);
            //Handle ready
            if (this.props.onCanPlay) {
                this.props.onCanPlay(
                    this.state.url
                );
            }
        })

        // On error
        this.v.video.addEventListener('error', (e) => {
            log.error(`ERROR WHILE PLAYING MOVIE: ${JSON.stringify(e)}`);
        })

        //When player load
        this.v.video.addEventListener('loadedmetadata', () => {
            log.info('PLAYER METADATA LOADED');

            // Convert to vtt
            for (let subtitle of Object.keys(this.props.subs)) {
                if (!setting.subs.available.includes(subtitle))
                    continue;

                // Transform subs
                subs.urlSrt2VttFile(
                    this.props.subs[subtitle].link
                ).then(({vtt, raw}) => {
                    // If selected sub match
                    log.info('ADDING ' + subtitle.toUpperCase() + ' SUBTITLE: ' + vtt);
                    let _elem = document.createElement('track');
                    let selectedSub = Object.is(subtitle, this.props.subSelected)
                    if (selectedSub) cast.setSub(raw);
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
                    log.error(`ERROR PARSING SUBS: ${JSON.stringify(e)}`);
                })
            }
        });

        window.addEventListener("keyup", (e) => {
            let keyCode = e.which || e.keyCode;
            if (Object.is(keyCode, 71)) this.addOffset(0.5); //G
            if (Object.is(keyCode, 72)) this.removeOffset(0.5); //H
            //if (Object.is(keyCode, 83)) this.syncSubs();
        });

        // Lets run
        this.startStreaming();
    }

    startStreaming() {
        //Start streamer
        const uriToStream = `${gatewayHelper.dummyParse(this.props.movie)}`
        log.info('STREAMING MOVIE: ' + this.props.movie.title.toUpperCase());
        log.warn(uriToStream);
        this.streamer.play(uriToStream, {
            videoRef: this.v,
            onReady: this.onReady,
            onProgress: this.onProgress,
            onError: this.onError
        });
    }

    stopStreaming() {
        this.streamer.stop();
        cast.stop();
    }


    get streamer() {
        const movie = this.props.movie
        return resourceHelper[`${movie.type}Streamer`](this.v);
    }

    componentDidCatch(error, info) {
        console.dir("Component Did Catch Error");
        log.error(error);
        log.info(info);
    }

    // destroy player on unmount
    componentWillUnmount() {
        log.warn('STREAMING STOPPED BY USER');
        this.stopStreaming()
    }

    onReady = (url) => {
        log.info('READY TO PLAY MOVIE: ' + url);
        this.setState({url: url});
        this.forceUpdate(() => {
            this.props.onReady &&
            this.props.onReady(url);
        })
    }

    onProgress = (...args) => {
        //Handle progress
        if (this.props.onProgress) {
            this.props.onProgress(...args);
        }
    }

    onError = (e) => {
        //Handle error
        log.error(`ERROR WHILE STREAMING: ${JSON.stringify(e)}`);
        this.props.onError && this.props.onError(e);
    }

    getVideoRef = (ref) => {
        this.v = ref
    }

    render() {
        return <div className={(this.props.canPlay && "left relative full-height full-width") || "invisible"}>
            <AppMoviesPlayerShare devices={this.state.devices} onChange={this.onSelectDevice}/>
            {this.state.url && <AppMoviesPlayerVideo src={this.state.url} ref={this.getVideoRef}/>}
        </div>
    }
}
