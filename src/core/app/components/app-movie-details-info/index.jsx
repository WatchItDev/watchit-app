import React from 'react'
import PropTypes from 'prop-types'
import styled from "styled-components";

export default class AppMovieDetailInfo extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			year: {
				color: 'danger',
				icon: 'calendar'
			},
			rating: {
				color: 'success',
				icon: 'star'
			},
			runtime: {
				color: 'primary',
				icon: 'back-in-time'
			},
			rate: {
				color: 'warning',
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
				<MainTitle>
					{this.props.title}
				</MainTitle>
				<RatingContainer>
					{
						Object.entries(this.props.info).filter(([k, v]) => v ? k : false).map(([char, val], idx) => {
							return (
								<RatingItem color={this.state[char]['color']} key={val}>
									<RatingIcon className={`icon-${this.state[char]['icon']}`}/>
									<span>{val}</span>
								</RatingItem>
							)
						})
					}
				</RatingContainer>
			</>
		)
	}
}


const MainTitle = styled.h1`
	margin: 0 0 20px 0;
	width: 100%;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	font-weight: 300;
	word-break: break-all;
	padding: 0 0.75rem;
	color: #fff;
`;

const RatingContainer = styled.div`
	width: 100%;
	display: flex;
	padding: 0 0.75rem;
`;

const handleColorType = color => {
	switch (color) {
		case "primary":
			return "#03a9f3";
		case "danger":
			return "#F44336";
		case "success":
			return "#4CAF50";
		case "warning":
			return "#ff9800";
		default:
			return "#fff";
	}
};

const RatingItem = styled.strong`
	margin-right: 1.5rem;
	font-size: 1.8rem;
	font-weight: 300;
	display: flex;
	align-items: center;
	color: ${({color}) => handleColorType(color)};
`;

const RatingIcon = styled.i`
	margin-right: 0.5rem;
`;