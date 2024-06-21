import React from 'react'
import PropTypes from 'prop-types'
import Background from '@/render/package/components/Background/'
import BarLoader from '@/render/package/components/BarLoader/'
import ButtonClose from '@/render/package/components/ButtonClose/'

export default class PlayerLoader extends React.PureComponent {
  static get propTypes () {
    return {
      stateText: PropTypes.string.isRequired,
      statePercent: PropTypes.number.isRequired
    }
  }

  render () {
    return (
      <div className='output-process valign-wrapper full-width full-height'>
        <div className='app_loader'>
          {this.props.onClose && <ButtonClose onClick={this.props.onClose} />}
          <Background absolute />
          <BarLoader stateText={this.props.stateText} statePercent={this.props.statePercent} />
        </div>
      </div>
    )
  }
}
