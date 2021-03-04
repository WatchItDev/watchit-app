import React from 'react'
import BoxInput from 'components/app-inputs'

export default class AppMainTopInputs extends React.Component {
	
	constructor(props) {
		super(props);
		this.input = null;
	}
	
	shouldComponentUpdate() {
		return false;
	}
	
	onInput = (e) => {
		if (this.props.onInput(e)) {
			this.props.onInput(e)
		}
	}
	
	preventDefault(e) {
		e.preventDefault()
	}
	
	getRef = (ref) => {
		this.input = ref
	}
	
	render() {
		return (
			<form onSubmit={this.preventDefault} action="#">
				<BoxInput
					icon="icon-tv" onInput={this.onInput} required={true} ref={this.getRef}
					autoComplete="off" type="text" placeholder="Search..." name="search"/>
			</form>
		)
	}
}
