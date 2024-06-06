import React from 'react'
import PropTypes from 'prop-types'
import NavBarButton from '@components/NavBarButton'

export default class DetailsMenu extends React.PureComponent {
  constructor(props) {
    super(props)
    // Default state
    this.state = {
      resource: null
    }
  }

  static get propTypes() {
    return {
      id: PropTypes.string.isRequired
    }
  }

  onClick = (e) => {
    e.preventDefault()
    if (this.props.onClickMovie)
      this.props.onClickMovie(this.props.id)
  }


  render() {
    return (
      <nav className='col l12 m12 transparent z-depth-0'>
        <div className='nav-wrapper'>
          <NavBarButton
            text='Play' icon='icon-controller-play'
            link={{ onClick: this.onClick }}
          />
        </div>
      </nav>
    )
  }
}
