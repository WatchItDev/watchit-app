import React from 'react'
import all from 'it-all'

import BoxLoader from 'components/util-box-loader'
import MainHeader from 'components/util-header'
import BoxImage from 'components/app-image'
import AppMovieDetailInfo from 'components/app-movie-details-info'
import AppMovieDetailMenu from 'components/app-movie-details-menu'
import CustomScrollbars from 'components/util-scroller';
import ListCommaSplit from 'components/util-list-comma-split'

import Movie from 'resource/data/movies'
import gatewayHelper from 'resource/helpers/gatewayHelper'
import resourceHelper from "resource/helpers/resourceHelper";
import styled from "styled-components";

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
            <DetailsContainer>
                {/*Close button*/}
                <MainHeader text="Movie" icon="icon-tv" onClick={this.props.onClick}/>
                {/*Main Loader or Movie details*/}
                {
                    (this.state.movies
                        && <SectionsContainer>
                            {/*Aside*/}
                            <LeftSection>
                                {/*Poster*/}
                                <BoxImage
                                    className="full-width"
                                    preload={true}
                                    src={this.parseUriImage(
                                        this.state.movies.resource.images.large
                                    )}
                                />
                            </LeftSection>

                            {/*Main Section*/}
                            <RightSection>
                                <Header>
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
                                </Header>

                                {/*Genres*/}
                                <ListCommaSplit
                                    list={this.state.movies.genres}
                                />

                                {/*Description*/}
                                <MovieDescription>
                                    <CustomScrollbars
                                        autoHide
                                        autoHideTimeout={1000}
                                        autoHideDuration={200}
                                        thumbMinSize={30}
                                        universal={true}>
                                        <MovieDescriptionContent>
                                            <MovieDescriptionText>
                                                {this.state.movies.synopsis}
                                            </MovieDescriptionText>
                                        </MovieDescriptionContent>
                                    </CustomScrollbars>
                                </MovieDescription>

                                {/*Footer*/}
                                <Footer>
                                    <AppMovieDetailMenu
                                        movie={this.state.movies}
                                    />
                                </Footer>
                            </RightSection>
                        </SectionsContainer>
                    ) || <BoxLoader size="100"/>
                }
            </DetailsContainer>
        )
    }
}

const DetailsContainer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.95);
`;

const MovieDescriptionContent = styled.div`
  padding: 1rem;
  color: #9e9e9e;
  font-weight: 300;
`;

const MovieDescriptionText = styled.div`
  @media only screen and (min-width: 360px) {
    font-size: 1.2rem; 
  }
  @media only screen and (min-width: 420px) {
    font-size: 1.248rem; 
  }
  @media only screen and (min-width: 480px) {
    font-size: 1.296rem; 
  }
  @media only screen and (min-width: 510px) {
    font-size: 1.32rem; 
  }
  @media only screen and (min-width: 570px) {
    font-size: 1.368rem; 
  }
  @media only screen and (min-width: 630px) {
    font-size: 1.416rem; 
  }
  @media only screen and (min-width: 690px) {
    font-size: 1.464rem; 
  }
  @media only screen and (min-width: 750px) {
    font-size: 1.512rem; 
  }
  @media only screen and (min-width: 810px) {
    font-size: 1.56rem; 
  }
  @media only screen and (min-width: 870px) {
    font-size: 1.608rem; 
  }
  @media only screen and (min-width: 930px) {
    font-size: 1.656rem; 
  }
`;

const MovieDescription = styled.div`
  margin-bottom: 20px;
  
  @media (min-height: 601px) {
    height: 20vh;
  }
  
  @media (min-height: 701px) {
    height: 22vh;
  }

  @media (min-height: 768px) {
    height: 20vh;
  }

  @media (min-height: 800px) {
    height: 15vh;
  }

  @media (min-height: 850px) {
    height: 26vh;
  }

  @media (min-height: 1027px) {
    height: 28vh;
  }

  @media (min-height: 1080px) {
    height: 30vh;
  }
`;

const Footer = styled.footer`
  margin-bottom: 20px;
`;

const Header = styled.header`
  margin-bottom: 20px;
`;

const RightSection = styled.section`
  width: 66.66667%;
  padding: 0 0.75rem;
`;

const LeftSection = styled.section`
  width: 33.33333%;
  padding: 0 0.75rem;
  position: relative;
`;

const SectionsContainer = styled.section`
  display: flex;
  height: 100%;
  margin-top: 5vh;
  padding: 0 1vw;
  margin-bottom: 20px;
`;