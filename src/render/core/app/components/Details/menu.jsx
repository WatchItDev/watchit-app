import React from 'react'
import PropTypes from 'prop-types'
import NavBarButton from '@components/NavBarButton/'

import TrailerPop from './trailer'
import gatewayHelper from '@helpers/gateway'
import cryptHelper from '@helpers/crypt'

export default class DetailsMenu extends React.PureComponent {
  constructor (props) {
    super(props)
    // Default state
    this.state = {
      resource: null,
      modalOpen: false
    }
  }

  static get propTypes () {
    return {
      movie: PropTypes.object.isRequired
    }
  }

  componentDidMount () {
    this.prepareDataToPlayer()
  }

  prepareDataToPlayer () {
    const id = this.props.movie._id
    const type = gatewayHelper.getVideoProtocol(this.props.movie.resource)
    const route = gatewayHelper.parseMovie(this.props.movie.resource)

    this.setState({
      resource: cryptHelper.toBase64(
        JSON.stringify({
          id, type, route
        })
      )
    })
  }

    handleCloseTrailer = () => {
      this.setState({
        modalOpen: false
      })
    }

    openTrailer = (e) => {
      e.preventDefault()
      this.setState({
        modalOpen: true
      })
    }

    render () {
      return (
        <nav className='col l12 m12 transparent z-depth-0'>
          <div className='nav-wrapper'>

            {
                        this.state.modalOpen &&
                          <TrailerPop
                            trailer={this.props.movie.trailer_code}
                            onClose={this.handleCloseTrailer}
                          />
                    }

            {/* Play */}
            <NavBarButton
              text='Play' icon='icon-controller-play'
              link={{ href: `#/play/${this.state.resource}` }}
            />

            {
                        this.props.movie.trailer_code &&
                          <NavBarButton
                            text='Trailer' icon='icon-video' mrb={7}
                            link={{ onClick: this.openTrailer, href: '#' }}
                          />
                    }
          </div>
        </nav>
      )
    }
}
