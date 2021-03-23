import Plyr from 'plyr';
import React from 'react'

import PropTypes from 'prop-types'
import setting from 'core/settings'
import AppMoviesPlayerShare from '../app-movie-player-share'
import AppMoviesPlayerVideo from '../app-movie-player-video'
import gatewayHelper from "core/resources/helpers/gateway";
import resourceHelper from "core/resources/helpers/streaming";

const log = window.require("electron-log");
const subs = window.bridge.Subs
const cast = window.bridge.DLNA

const DEFAULT_PLAYER_CONTROLS = [
    'play-large', // The large play button in the center
    'restart', // Restart playback
    'rewind', // Rewind by the seek time (default 10 seconds)
    'play', // Play/pause playback
    'fast-forward', // Fast forward by the seek time (default 10 seconds)
    'progress', // The progress bar and scrubber for playback and buffering
    'current-time', // The current time of playback
    'duration', // The full duration of the media
    'mute', // Toggle mute
    'quality', // Quality control
    'volume', // Volume control
    'captions', // Toggle captions
    'settings', // Settings menu
    'fullscreen', // Toggle fullscreen
]


export default class AppMoviesPlayer extends React.Component {
    constructor(props) {
        super(props);

        this.subs = {};
        this.v = null;

        //Initial State
        this.state = {
            url: '', // Empty uri on start
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
            subs: {}
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
        return this.player?.language &&
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
        ).requestUpdate().removeAllListeners(
            // Clean any previous listener
        ).on('status', (status) => {
            log.info('Status:' + status);
        }).on('device', () => {
            log.info('New device');
            this.setState({devices: this.players})
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

    getPlayer(options = {}) {
        const playerSettings = {
            ...{
                autoplay: true,
                settings: ['captions', 'speed', 'quality'],
                controls: DEFAULT_PLAYER_CONTROLS,
            }, ...options
        }

        // Init player
        this.player = new Plyr(this.v.video, playerSettings)
        //On player change subtitles
        this.player.on('languagechange', () => {
            if (!this.currentSub) return;
            cast.setSub(this.currentSub)
        })

        // On ready to play
        this.v.video.addEventListener('canplay', () => {
            log.info('Playing movie');
            //Handle ready
            if (this.props.onCanPlay) {
                this.props.onCanPlay(
                    this.state.url
                );
            }
        })

        // On error
        this.v.video.addEventListener('error', (e) =>
            log.error(`Error while playing movie: ${JSON.stringify(e)}`)
        )

        //When player load
        this.v.video.addEventListener('loadedmetadata', () =>
            log.warn('Player metadata loaded')
        );
    }

    startStreaming() {
        //Start streamer
        log.info('STREAMING MOVIE: ' + this.props.movie.title.toUpperCase());
        const uriToStream = `${gatewayHelper.dummyParse(this.props.movie)}`
        const streamer = this.streamer.play(uriToStream, {videoRef: this.v.video});
        streamer.on('ready', this.onReady)
        streamer.on('progress', this.onProgress)
        streamer.on('error', this.onError)
        streamer.on('start', (op) => this.getPlayer(op))
    }

    stopStreaming() {
        this.streamer.stop();
        this.streamer.removeAllListeners();
        cast.stop();
    }


    get streamer() {
        return resourceHelper.streamer(
            this.props.movie.type
        );
    }

    componentDidCatch(error, info) {
        log.error("Component Did Catch Error");
        log.error(error);
        log.info(info);
    }

    // destroy player on unmount
    componentWillUnmount() {
        log.warn('STREAMING STOPPED BY USER');
        this.stopStreaming()
    }

    onReady = (url, ...rest) => {
        log.info('Ready to play movie: ' + url);
        if (url) { // Force update with url if passed
            const [mime] = rest // Default streaming type
            this.setState({url: url, type: mime}, () => {
                this.props.onReady &&
                this.props.onReady(url, ...rest);
            });
        }
    }

    onProgress = (...args) => {
        //Handle progress
        if (this.props.onProgress) {
            this.props.onProgress(...args);
        }
    }

    onError = (e) => {
        //Handle error
        this.props.onError && this.props.onError(e);
        log.error(`Error while streaming: ${JSON.stringify(e)}`);
        log.warn(`Retrying...`);
        this.stopStreaming();
        this.startStreaming();
    }

    getVideoRef = (ref) => {
        this.v = ref
    }

    render() {
        return <div className={(this.props.canPlay && "left relative full-height full-width") || "invisible"}>
            <AppMoviesPlayerShare devices={this.state.devices} onChange={this.onSelectDevice}/>
            <AppMoviesPlayerVideo src={this.state.url} type={this.state.type} ref={this.getVideoRef}/>
        </div>
    }
}
