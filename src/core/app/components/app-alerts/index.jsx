import React from 'react'
//import PropTypes from 'prop-types'

export default class BoxAlert extends React.Component {
	static get defaultProps() {
		return {
			label: 'error-label'
		}
	}
	
	
	render() {
		return (
			<div className={"bold z-depth-1 lighten-2 text-center " + this.props.label}>
				{this.props.children}
			</div>
		)
	}
}
