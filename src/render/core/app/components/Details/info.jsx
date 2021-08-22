import React from 'react'
import PropTypes from 'prop-types'
import FlowText from '../FlowText'

export default class DetailsInfo extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      year: {
        color: 'red',
        align: 'left',
        icon: 'calendar'
      },
      rating: {
        color: 'green',
        align: 'center',
        icon: 'star'
      },
      runtime: {
        color: 'blue',
        align: 'right',
        icon: 'back-in-time'
      },
      rate: {
        color: 'orange',
        align: 'right',
        icon: 'bell'
      }
    }
  }

  static get propTypes () {
    return {
      title: PropTypes.string.isRequired,
      info: PropTypes.object.isRequired
    }
  }

  render () {
    return (
      <div className='d-flex flex-column'>
        {/* Title */}
        <h1 className='white-text margin-top-0 font-type-titles truncate'>
          {this.props.title}
        </h1>
        <div className='d-flex'>
          {
            Object.entries(this.props.info).filter(([k, v]) => v ? k : false).map(([char, val], idx) => {
              return (
                <FlowText key={idx}>
                  <strong
                    className={this.state[char].color + '-text flow-text ' + this.state[char].align + '-align' + ' d-flex align-items-center margin-right-14'}
                    key={char}
                  >
                    <i className={'left margin-right-4 icon-' + this.state[char].icon} />
                    {val}
                  </strong>
                </FlowText>
              )
            })
          }
        </div>
      </div>
    )
  }
}
