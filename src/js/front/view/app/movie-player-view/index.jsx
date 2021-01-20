import React from 'react'
import AppMoviePlayer from 'js/front/components/views/movie-player-components/app-main-movie-player/index'
import AppMoviePlayerLoader from 'js/front/components/views/movie-player-components/app-main-movie-player-loader/index'
import AppMoviesPlayerSwarm from 'js/front/components/views/movie-player-components/app-main-movie-player-swarm/index'
import MainLoader from 'js/front/components/generic/util-main-loader/index'
import BtnClose from 'js/front/components/generic/util-btn-close/index'
import Movie from 'js/resources/data/movies'
import cryptHelper from 'js/resources/helpers/cryptHelper'
import utilHelper from 'js/resources/helpers/utilHelper'
import setting from 'js/settings'

//Movie player view class
export default class MoviePlayer extends React.Component {
    constructor(props) {
        super(props);

        //Movie
        this.ingest = window.Ingest;
        this.movie = new Movie(this.ingest.p);

        //Decode string and pass to json object
        this.state = {
            state: 'Connecting',
            percent: 0,
            flix: null,
            canPlay: false,
            stopped: false,
            toggle_screen: false
        };

    }


    componentDidMount() {
        //Decode param
        let _movieInfo = JSON.parse(
            cryptHelper.fromBase64(
                this.props.match.params.torrent
            )
        );

        //Set subs from movie if exists
        this.movie.get(_movieInfo.id,).then((res) => {
            //Set new subs
            let selectedSub = this.props.match.params?.sub
            this.setState({
                movieInfo: _movieInfo,
                movieSubs: this.subs(res),
                movieSelectedSub: selectedSub
            });

        }).catch((e) => {
            console.log(e);
            console.log('Error in movie get')
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
        let s = res.subtitles
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

    onProgress = (percent, state) => {
        //Change state
        this.setState({
            state: state,
            percent: percent
        })
    }

    onReady = (url, flix) => {
        //Change state
        this.setState({
            state: 'Starting',
            flix: flix,
            percent: 100
        })
    }

    onCanPlay = () => {
        this.setState({
            canPlay: true
        })
    }

    render() {
        return (
            <div className="movie-player full-width full-height">
                <BtnClose action={`#/app/movies`}/>
                {
                    (
                        !this.state.canPlay &&
                        <div className="absolute full-width full-height player-overlay-loader">
                            <AppMoviePlayerLoader
                                stateText={this.state.state}
                                statePercent={this.state.percent}
                            />
                        </div>
                    )
                }

                {
                    (
                        this.state.movieInfo &&
                        <section className={`absolute full-height clearfix video-stream`}>
                            {/* Movie torrent info */}
                            {
                                (
                                    this.state.flix && this.state.canPlay &&
                                    <header className="row absolute z-index-100 top-2-vh left-2-vw clearfix">
                                        <div className="row">
                                            <h4 className="white-text bold font-type-titles">
                                                {this.state.movieInfo.title}
                                            </h4>
                                        </div>
                                        <div>
                                            <AppMoviesPlayerSwarm
                                                flix={this.state.flix}
                                            />
                                        </div>
                                    </header>
                                )
                            }

                            {/* Main player */}
                            <div className="full-height movie-box">
                                <AppMoviePlayer
                                    movie={this.state.movieInfo}
                                    subs={this.state.movieSubs}
                                    subSelected={this.state.movieSelectedSub}
                                    onProgress={this.onProgress}
                                    onReady={this.onReady}
                                    onCanPlay={this.onCanPlay}
                                />
                            </div>
                        </section>

                    )
                }
                {/*Loader box*/}
                {this.state.stopped && <MainLoader/>}
            </div>
        )
    }
}

