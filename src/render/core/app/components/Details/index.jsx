import React from 'react'

import Image from '@components/Image/'
import FlowText from '@components/FlowText/'
import BoxLoader from '@components/BoxLoader/'
import CustomScrollbars from '@components/Scroller/'
import ListCommaSplit from '@components/ListCommaSplit/'

import DetailsHeader from './header'
import DetailsInfo from './info'
import DetailsMenu from './menu'

import Movie from '@db/movies'
import gatewayHelper from '@helpers/gateway'
import { Broker as broker } from '@main/bridge'

// Access to main process bridge prop
export default class Details extends React.PureComponent {
  constructor (props) {
    super(props)
    // Auth object
    this.movie = new Movie(broker)
    this.state = { movies: null }
  }

  async componentDidMount () {
    // Movie details
    const movies = await this.movie.get(this.props.id)
    this.setState({ movies })
  }

  render () {
    return (
      <div className='absolute full-height movie-details'>
        {/* Close button */}
        <DetailsHeader text='Movie' icon='icon-tv' onClick={this.props.onClick} />
        {/* Main Loader or Movie details */}
        {
          (this.state.movies &&
            <div className='d-flex movie-details-content'>
              {/* Aside */}
              <aside className='col l4 m4 movie-details-poster relative'>
                {/* Poster */}
                <Image
                  className='full-width' preload
                  pulseStyle={{ top: '20rem' }}
                  src={gatewayHelper.parsePosterUri(
                    this.state.movies.resource,
                    'large'
                  )}
                />
              </aside>

              {/* Main Section */}
              <section className='col l8 m8 movie-details-info'>
                <header className='row'>
                  <div className='col l12 s12 m12'>
                    {/* Movie Info */}
                    <DetailsInfo
                      title={this.state.movies.title}
                      info={{
                        year: this.state.movies.year,
                        rating: this.state.movies.rating,
                        runtime: this.state.movies.runtime,
                        rate: this.state.movies.mpa_rating
                      }}
                    />
                  </div>
                </header>

                {/* Genres */}
                <section className='row'>
                  <div className='col l12 s12 m12'>
                    <ListCommaSplit
                      list={this.state.movies.genres}
                    />
                  </div>
                </section>

                {/* Description */}
                <section className='row movie-details-description clearfix'>
                  <CustomScrollbars
                    autoHide
                    autoHideTimeout={1000}
                    autoHideDuration={200}
                    thumbMinSize={30}
                    universal
                  >
                    <div className='col l12 s12 m12'>
                      <FlowText>
                        <span>
                          {this.state.movies.synopsis}
                        </span>
                      </FlowText>
                    </div>
                  </CustomScrollbars>
                </section>

                {/* Footer */}
                <footer className='row nav-bar-movie-details'>
                  <DetailsMenu
                    movie={this.state.movies}
                  />
                </footer>
              </section>
            </div>
          ) || <BoxLoader size='100' />
        }
      </div>
    )
  }
}
