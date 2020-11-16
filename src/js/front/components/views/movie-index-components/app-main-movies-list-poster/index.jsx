import React from 'react'
import BoxImage from 'js/front/components/forms/app-image/index.jsx'
import PulseLoader from 'js/front/components/generic/util-pulse-loader/index.jsx'

export default class AppMoviesListPoster extends React.Component {
	
	shouldComponentUpdate() {
		return false
	}
	
	onClick = (e) => {
		e.preventDefault();
		this.props.onClick &&
		this.props.onClick(this.props.id)
	}
	
	render() {
		return (
			<div className={`col relative movies-poster padding-left-2 padding-right-2 item`}>
				{
					!this.props.empty && <PulseLoader/>
				}
				{
					(!this.props.placeHolder && !this.props.empty) &&
					<a href={`/#`} onClick={this.onClick}>
						{/* Image Box */}
						<BoxImage src={this.props.image}/>
						{/* Label Box */}
						<div className="hover-poster-box full-width full-height">
							<div className="hover-info absolute bottom-1-rem">
								<strong className="white-text truncate">
									{this.props.title}
								</strong>
								<span className="green-text">
                                <i className="icon-calendar margin-right-3-p"/>
									{this.props.year}
                            </span>
								<span className="orange-text margin-left-5-p">
                                <i className="icon-star margin-right-2-p"/>
									{this.props.rating}
                            </span>
							</div>
						</div>
					</a>
				}
			</div>
		)
	}
}
