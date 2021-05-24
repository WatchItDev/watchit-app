import React from 'react'
import PropTypes from 'prop-types'

export default class BarLoader extends React.PureComponent {
	static get propTypes() {
		return {
			stateText: PropTypes.string.isRequired,
			statePercent: PropTypes.number.isRequired
		}
	}
	
	render() {
		return <div className="center-block valign loading_progress">
			<div>
				<h3 className="font-type-titles align-center white-text loading_title">
					{this.props.stateText}
				</h3>
			</div>
			{
				this.props.statePercent > 0 &&
				<div className="absolute full-width no-left">
					<div className={"progress lighten-1 width-" + this.props.statePercent + '-p'}>
						<div className="determinate amber darken-4"/>
					</div>
				</div>
			}
			{
				this.props.statePercent > 0 &&
				<div className="relative top-10 text-center">
					<h3 className="font-type-titles white-text loading_subtitle">
						{this.props.statePercent}%
					</h3>
				</div>
			}
		</div>
		
	}
}
