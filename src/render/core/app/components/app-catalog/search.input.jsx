import React from 'react'
import Input from 'components/app-inputs/'

export default class CatalogSearchInput extends React.Component {
  constructor (props) {
    super(props)
    this.input = null
  }

  static get defaultProps () {
    return {
      size: 'm6 l6'
    }
  }

  shouldComponentUpdate () {
    return false
  }

	onInput = (e) => {
	  if (this.props.onInput(e)) {
	    this.props.onInput(e)
	  }
	}

	preventDefault (e) {
	  e.preventDefault()
	}

	getRef = (ref) => {
	  this.input = ref
	}

	render () {
	  return (
  <div className='clearfix'>
    <form onSubmit={this.preventDefault} action='#'>
      <div className={'input-field-black margin-top-0 col ' + this.props.size}>
        <Input
          icon='icon-tv' onInput={this.onInput} required ref={this.getRef}
          autoComplete='off' type='text' placeholder='Search...' name='search'
        />
      </div>
    </form>
  </div>
	  )
	}
}
