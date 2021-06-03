import React from 'react'
import NavBarMenu from 'components/app-nav-bar-menu/'

export default class PlayerShare extends React.Component {
  getOptions = () => {
    return this.props.devices.map((e, i) => {
      return {
        default: false,
        label: e,
        action: i
      }
    })
  }

  handleChange = (index) => {
    this.props.onChange &&
    this.props.onChange(index)
  }

  render () {
    return (
      <>
        <div className='share-menu'>
          <NavBarMenu
            btnText='' icon='icon-tv'
            onChange={this.handleChange} list={this.getOptions()}
          />
        </div>
      </>
    )
  }
}
