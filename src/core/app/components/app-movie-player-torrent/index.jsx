import React from 'react'
import PropTypes from 'prop-types'
import AppMoviePlayer from "../app-movie-player";
import AppMoviesPlayerSwarm from "../app-movie-player-swarm";
import AppMoviesPlayerHeader from "../app-movie-player-header";
import AppMoviePlayerLoader from "../app-movie-player-loader";

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

    onProgress = (_, percent, state) => {
        //Change state
        this.setState({
            state: state,
            percent: parseInt(percent)
        })
    }

    onReady = (url, ...rest) => {
        const [flix] = rest
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
                                statePercent={this.state.percent}/>
                            />
                        </div>
                    )
                }

                <section className={`absolute full-height clearfix video-stream`}>
                    {/* Movie torrent info */}
                    {
                        (
                            this.state.flix && this.state.canPlay &&
                            <AppMoviesPlayerHeader title={this.props.movie.title}>
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
                            canPlay={this.state.canPlay}
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
