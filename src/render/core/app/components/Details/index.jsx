import React from 'react'

import Image from '@components/Image/'
import FlowText from '@components/FlowText/'
import BoxLoader from '@components/BoxLoader/'
import CustomScrollbars from '@components/Scroller/'
import ListCommaSplit from '@components/ListCommaSplit/'

import DetailsHeader from './header'
import DetailsInfo from './info'
import DetailsMenu from './menu'

import { DB as db } from '@main/bridge'
import gateway from '@helpers/gateway'

// Access to main process bridge prop
export default class Details extends React.PureComponent {
  constructor(props) {
    super(props)
    // Auth object
    this.db = db.connect(this.props.cid)
    this.state = {
      year: 0,
      rating: 0,
      title: '',
      synopsis: '',
      runtime: 0,
      images: {},
      genres: [],
      ready: false
    }
  }

  async componentDidMount() {
    // Movie details
    const movies = await this.db.get(this.props.id)
    this.setState({ ...movies, ready: true })
  }

  render() {
    return (
      <div className='absolute full-height movie-details'>
        {/* Close button */}
        <DetailsHeader text='Movie' icon='icon-tv' onClick={this.props.onClose} />
        {/* Main Loader or Movie details */}
        {
          (this.state.ready &&
            <div className='d-flex movie-details-content'>
              {/* Aside */}
              <aside className='col l4 m4 movie-details-poster relative'>
                {/* Poster */}
                <Image
                  className='full-width' preload
                  pulseStyle={{ top: '20rem' }}
                  src={gateway.parse(
                    this.state.images.large
                  )}
                />
              </aside>

              {/* Main Section */}
              <section className='col l8 m8 movie-details-info'>
                <header className='row'>
                  <div className='col l12 s12 m12'>
                    {/* Movie Info */}
                    <DetailsInfo
                      title={this.state.meta.title}
                      info={{
                        year: this.state.meta.year,
                        rating: this.state.meta.rating,
                        runtime: this.state.meta.runtime,
                      }}
                    />
                  </div>
                </header>

                {/* Genres */}
                <section className='row'>
                  <div className='col l12 s12 m12'>
                    <ListCommaSplit
                      list={this.state.meta.genres}
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
                          {this.state.meta.synopsis}
                        </span>
                      </FlowText>
                    </div>
                  </CustomScrollbars>
                </section>

                {/* Footer */}
                <footer className='row nav-bar-movie-details'>
                  <DetailsMenu
                   id={this.props.id}
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
