import React from 'react'
import PropTypes from 'prop-types'
import AppMoviePlayer from "../app-movie-player";
import AppMoviesPlayerHeader from "../app-movie-player-header";
import AppMoviePlayerLoader from "../app-movie-player-loader";

export default class AppMoviesPlayerHLS extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            canPlay: false,
            state: 'Connecting'
        }
    }

    static get propTypes() {
        return {
            movie: PropTypes.object.isRequired
        }
    }

    onProgress = () => {
        // abstract method just keep going
    }

    onReady = () => {
        // abstract method just keep going
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
                            <AppMoviePlayerLoader stateText={this.state.state} statePercent={0}/>
                            />
                        </div>
                    )
                }

                <section className={`absolute full-height clearfix video-stream`}>
                    {/* Movie torrent info */}
                    {this.state.canPlay && <AppMoviesPlayerHeader title={this.props.movie.title}/>}

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
