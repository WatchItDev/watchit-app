import React from 'react'
import PropTypes from 'prop-types'

export default class DetailsInfo extends React.Component {
	constructor(props) {
		super(props);
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
	
	static get propTypes() {
		return {
			title: PropTypes.string.isRequired,
			info: PropTypes.object.isRequired
		}
	}
	
	render() {
		return (
			<>
				{/*Title*/}
				<div className="col l12 m12 s12 width-55-vw">
					<h1 className="white-text margin-top-0 font-type-titles truncate">
						{this.props.title}
					</h1>
				</div>
				<div className="col l12 m12 s12">
					{
						Object.entries(this.props.info).filter(([k, v]) => v ? k : false).map(([char, val], idx) => {
							return (
								<div className={"col " + (Object.is(idx, 0) && 'padding-left-0')} key={char}>
									<strong
										className={this.state[char]['color'] + "-text flow-text " + this.state[char]['align'] + "-align"}>
										<i className={"normalize-medium-icon left margin-right-8 icon-" + this.state[char]['icon']}/>
										{val}
									</strong>
								</div>
							)
						})
					}
				</div>
			</>
		)
	}
}
