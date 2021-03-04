import React from 'react'
import BoxImage from 'components/app-image'
import PulseLoader from 'components/util-pulse-loader'
import styled from 'styled-components'

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
			<Poster>
				{
					!this.props.empty && <PulseLoader/>
				}
				{
					(!this.props.placeHolder && !this.props.empty) &&
					<PosterLink href={`/#`} onClick={this.onClick}>
						{/* Image Box */}
						<BoxImage src={this.props.image}/>
						{/* Label Box */}
						<PosterInfo>
							<PosterInfoTitle>
								{this.props.title}
							</PosterInfoTitle>
							<PosterInfoContent>
								<PosterInfoItem color="success">
									<PosterInfoItemIcon className="icon-calendar"/>
									{this.props.year}
								</PosterInfoItem>
								<PosterInfoItem color="warning">
									<PosterInfoItemIcon className="icon-star"/>
									{this.props.rating}
								</PosterInfoItem>
							</PosterInfoContent>
						</PosterInfo>
					</PosterLink>
				}
			</Poster>
		)
	}
}

const Poster = styled.div`
	width: 14.26667%;
	flex: 1 1;
	padding: 0;
	margin: 0.5rem;
	position: relative;
	
	&:hover > a > div {
		opacity: 1;
	}
`;

const PosterLink = styled.a`
	text-decoration: none;
	background-color: transparent;
`;

const PosterInfo = styled.div`
	position: absolute;
	opacity: 0;
	bottom: 1rem;
	left: 0;
	border-radius: 0 5px 5px 0;
	padding: 0.5rem;
	background-color: rgba(0, 0, 0, 0.8);
	max-width: 90%;
	min-width: 90%;
	transition: all 0.3s ease-in-out;
`;

const PosterInfoTitle = styled.strong`
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	word-break: break-all;
	font-weight: 500;
	color: #fff;
	display: block;
`;

const PosterInfoContent = styled.strong`
	display: flex;
	flex-wrap: wrap;
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

const PosterInfoItem = styled.div`
    margin-right: 1rem;
	color: ${({color}) => handleColorType(color)};
    display: flex;
    align-items: center;
    justify-content: center;
`;

const PosterInfoItemIcon = styled.div`
    margin-right: 0.2rem;
    font-size: 1rem;
`;
