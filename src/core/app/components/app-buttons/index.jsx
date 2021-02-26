import React from 'react'
import PointsLoader from 'core/app/components/util-points-loader'

export default class BoxButton extends React.Component {
	static get defaultProps() {
		return {
			clicked: false,
			type: 'button'
		}
	}
	
	render() {
		return (
			<button
				type={this.props.type}
				className={"lowercase full-width waves-effect waves-light btn " + this.props.className}
				onClick={this.props.onClick}
			>
				{
					/*If click*/
					((Object.is(this.props.type, "submit") || this.props.forceLoader)
					&& this.props.clicked && <PointsLoader/>) || this.props.children
				}
			</button>
		)
	}
}
