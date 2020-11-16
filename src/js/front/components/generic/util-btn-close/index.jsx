import React from 'react'


export default class BtnClose extends React.Component {
	constructor(props) {
		super(props);
	}
	
	static get defaultProps() {
		return {
			action: '#'
		}
	}
	
	shouldComponentUpdate() {
		return false;
	}
	
	render() {
		return (
			<a href={this.props.action}
			   className="btn-close clearfix font-size-45">
				<i className="icon-cross white-text"/>
			</a>
		)
	}
}
