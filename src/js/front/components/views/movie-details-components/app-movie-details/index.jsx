import React from 'react'
import BoxLoader from 'js/front/components/generic/util-box-loader/index.jsx'
import MainHeader from 'js/front/components/generic/util-header/index.jsx'
import BoxImage from 'js/front/components/forms/app-image/index.jsx'
import AppMovieDetailInfo from 'js/front/components/views/movie-details-components/app-movie-details-info/index.jsx'
import AppMovieDetailMenu from 'js/front/components/views/movie-details-components/app-movie-details-menu/index.jsx'
import FlowText from 'js/front/components/generic/util-flow-text/index.jsx'
import CustomScrollbars from 'js/front/components/generic/util-scroller/index.jsx';
import ListCommaSplit from 'js/front/components/generic/util-list-comma-split/index.jsx'
import utilHelper from 'js/resources/helpers/utilHelper'
import Movie from 'js/resources/data/movies'

//Login view class
export default class MovieDetails extends React.PureComponent {
	constructor(props) {
		super(props);
		//Auth object
		this.ingest = window.Ingest;
		this.streamer = window.Streamer;
		this.movie = new Movie(this.ingest.p);
		this.state = {movies: null};
	}
	
	componentDidMount() {
		//Movie details
		this.movie.get(
			this.props.id,
		).then((r) => {
			// Await all get done
			// logHelper.info(`METADATA LOADED:`);
			Promise.all(r.torrents.map((t, i) => this.streamer.getHealth(t.hash, i))).then((v) => {
				v.forEach((h) => r.torrents[h.index]['health'] = utilHelper.calcHealth(h));
				this.setState({movies: r});
			})
		})
	}
	
	componentWillUnmount() {
		console.log('Unmounted Details');
	}
	
	render() {
		return (
			<div className="absolute full-height movie-details">
				{/*Close button*/}
				<MainHeader text="Movie" icon="icon-tv" onClick={this.props.onClick}/>
				<section className="row clearfix full-height margin-top-5-vh padding-left-2-vw">
					{/*Main Loader or Movie details*/}
					{
						this.state.movies
						&& <div className="d-flex">
							{/*Aside*/}
							<aside className="col l4 m4 movie-details-poster relative">
								{/*Poster*/}
								<BoxImage
									className="full-width"
									src={this.state.movies.large_cover_image}
									preload={true}
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
                                                {this.state.movies.description_full}
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
						</div> || <BoxLoader size="100"/>
					}
				</section>
			</div>
		)
	}
}