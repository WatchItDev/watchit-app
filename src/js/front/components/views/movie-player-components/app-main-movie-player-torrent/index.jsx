import React from 'react'
import PropTypes from 'prop-types'
import AppMoviesPlayerSwarm from "../app-main-movie-player-swarm";
import AppMoviePlayer from "../app-main-movie-player";
import AppMoviesPlayerHeader from "../app-main-movie-player-header";
import AppMoviePlayerLoader from "../app-main-movie-player-loader";

export default class AppMoviesPlayerTorrent extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            flix: null,
            canPlay: false,
            state: 'Connecting',
            percent: 0
        }
    }

    static get propTypes() {
        return {
            movie: PropTypes.object.isRequired
        }
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
            <>
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

                <section className={`absolute full-height clearfix video-stream`}>
                    {/* Movie torrent info */}
                    {
                        (
                            this.state.flix && this.state.canPlay &&
                            <AppMoviesPlayerHeader title={this.state.movieInfo.title}>
                                <AppMoviesPlayerSwarm
                                    flix={this.state.flix}
                                />
                            </AppMoviesPlayerHeader>

                        )
                    }

                    {/* Main player */}
                    <div className="full-height movie-box">
                        <AppMoviePlayer
                            movie={this.props.movie}
                            subs={this.props.subs}
                            subSelected={this.props.selectedSub}
                            onProgress={this.onProgress}
                            onReady={this.onReady}
                            onCanPlay={this.onCanPlay}
                        />
                    </div>
                </section>
            </>
        )
    }
}
