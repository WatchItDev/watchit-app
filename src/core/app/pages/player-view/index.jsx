import React from 'react'
import AppMoviesPlayerTorrent from "components/app-movie-player-torrent";
import MainLoader from 'components/util-main-loader'
import BtnClose from 'components/util-btn-close'
import Movie from 'resource/data/movies'
import cryptHelper from 'resource/helpers/cryptHelper'
import utilHelper from 'resource/helpers/utilHelper'
import setting from 'settings'

// Access to main process bridge prop
const log = window.require("electron-log");
const broker = window.bridge.Broker;

//Movie player pages class
export default class MoviePlayer extends React.Component {
    constructor(props) {
        super(props);

        //Movie init local db
        this.movie = new Movie(broker);
        //Decode string and pass to json object
        this.state = {
            stopped: false,
            toggle_screen: false
        };

    }


    componentDidMount() {
        //Decode param
        let _movieInfo = JSON.parse(
            cryptHelper.fromBase64(
                this.props.match.params.resource
            )
        );

        //Set subs from movie if exists
        this.movie.get(_movieInfo.id).then((res) => {
            //Set new subs
            let selectedSub = this.props.match.params?.sub
            this.setState({
                movieInfo: _movieInfo,
                movieSubs: this.subs(res),
                movieSelectedSub: selectedSub
            });

        }).catch((e) => {
            log.error('Error in movie get', e)
        })
    }


    preSubs(subs, collection = {}) {
        Object.values(subs).forEach((el) => {
            Object.keys(el).reduce((o, i) => {
                let sIndex = utilHelper.sanitizeSubIndex(i)
                if (sIndex in o) o[sIndex] = [...o[sIndex], ...el[i]]
                if (!(sIndex in o)) o[sIndex] = el[i]
                return o
            }, collection)
        })
    }

    subs(res) {
        let subs = {}
        let s = res?.subtitles
        if (!s) return subs
        this.preSubs(s, subs);

        // Filter and get better sub rate
        return Object.keys(subs).filter(
            (k) => setting.subs.available.includes(k)
        ).reduce((obj, key) => {
            obj[key] = this.getBetterSub(subs[key])
            return obj
        }, {});
    }


    getBetterSub(subtitles) {
        //Get better sub
        return subtitles.sort((a, b) => {
            a = parseFloat(a.score || a.rating);
            b = parseFloat(b.score || b.rating);
            return a - b
        }).slice(-1)[0];
    }


    switchPlayer = (type) => {
        const types = {
            'torrent': AppMoviesPlayerTorrent,
            'hls': null
        }

        if (type in types)
            return types[type]
    }

    render() {
        return (
            <div className="movie-player full-width full-height">
                <BtnClose action={`#/app/movies`}/>

                {
                    (
                        this.state.movieInfo && React.createElement(
                            this.switchPlayer(this.state.movieInfo.type), {
                                movie: this.state.movieInfo,
                                subs: this.state.movieSubs,
                                selectedSub: this.state.movieSelectedSub
                            }
                        )
                    )
                }
                {/*Loader box*/}
                {this.state.stopped && <MainLoader/>}
            </div>
        )
    }
}

