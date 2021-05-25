import React from 'react'
import PropTypes from 'prop-types'
import uid from 'shortid'

export default class ListCommaSplit extends React.Component {
  shouldComponentUpdate () {
    return false
  }

  static get propTypes () {
    return {
      list: PropTypes.array.isRequired
    }
  }

  render () {
    return (
      <div className='col l12 m12 s12 truncate flow-text blue-grey-text'>
        {
          this.props.list.map((splitter) => {
            return (
              <span className='separated-comma' key={uid.generate()}>
                {splitter}
              </span>
            )
          })
        }
      </div>
    )
  }
}
