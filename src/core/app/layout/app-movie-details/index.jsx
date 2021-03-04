import React from 'react'
import all from 'it-all'

import BoxLoader from 'components/util-box-loader'
import MainHeader from 'components/util-header'
import BoxImage from 'components/app-image'
import AppMovieDetailInfo from 'components/app-movie-details-info'
import AppMovieDetailMenu from 'components/app-movie-details-menu'
import FlowText from 'components/util-flow-text'
import CustomScrollbars from 'components/util-scroller';
import ListCommaSplit from 'components/util-list-comma-split'

import Movie from 'resource/data/movies'
import gatewayHelper from 'resource/helpers/gatewayHelper'
import resourceHelper from "resource/helpers/resourceHelper";

// Access to main process bridge prop
const broker = window.bridge.Broker
export default class MovieDetails extends React.PureComponent {
    constructor(props) {
        super(props);
        //Auth object
        this.movie = new Movie(broker);
        this.state = {movies: null};
    }


    async componentDidMount() {
        // Movie details
        const movies = await this.movie.get(this.props.id)
        const videos = await all(resourceHelper.match(movies.resource.videos))
        const resource = Object.assign({}, movies.resource, {videos: videos})
        this.setState({movies: {...movies, ...{resource}}});
    }


    parseUriImage = (image) => {
        if (image) {
            // While load chunk of movies image = undefined
            // Check if valid param before
            return gatewayHelper.dummyParse(image)
        }
    }


    render() {
        return (
            <div className="absolute full-height movie-details">
                {/*Close button*/}
                <MainHeader text="Movie" icon="icon-tv" onClick={this.props.onClick}/>
                <section className="row clearfix full-height margin-top-5-vh padding-left-2-vw">
                    {/*Main Loader or Movie details*/}
                    {
                        (this.state.movies
                            && <div className="d-flex">
                                {/*Aside*/}
                                <aside className="col l4 m4 movie-details-poster relative">
                                    {/*Poster*/}
                                    <BoxImage
                                        className="full-width"
                                        preload={true}
                                        src={this.parseUriImage(
                                            this.state.movies.resource.images.large_image
                                        )}
                                    />
                                </aside>

                                {/*Main Section*/}
                                <section className="col l8 m8">
                                    <header className="row">
                                        {/*Movie Info*/}
                                        <AppMovieDetailInfo
                                            title={this.state.movies.title}
                                            info={{
                                                year: this.state.movies.year,
                                                rating: this.state.movies.rating,
                                                runtime: this.state.movies.runtime,
                                                rate: this.state.movies.mpa_rating
                                            }}
                                        />
                                    </header>

                                    {/*Genres*/}
                                    <section className="row">
                                        <ListCommaSplit
                                            list={this.state.movies.genres}
                                        />
                                    </section>

                                    {/*Description*/}
                                    <section className="row movie-details-description clearfix">
                                        <CustomScrollbars
                                            autoHide
                                            autoHideTimeout={1000}
                                            autoHideDuration={200}
                                            thumbMinSize={30}
                                            universal={true}>
                                            <FlowText>
                                            <span>
                                                {this.state.movies.synopsis}
                                            </span>
                                            </FlowText>
                                        </CustomScrollbars>
                                    </section>

                                    {/*Footer*/}
                                    <footer className="row nav-bar-movie-details">
                                        <AppMovieDetailMenu
                                            movie={this.state.movies}
                                        />
                                    </footer>
                                </section>
                            </div>
                        ) || <BoxLoader size="100"/>
                    }
                </section>
            </div>
        )
    }
}