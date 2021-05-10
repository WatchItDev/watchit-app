import React from 'react';
import styled from 'styled-components';

export default class BoxAlert extends React.Component {
	static get defaultProps() {
		return {
			type: 'danger'
		}
	}

	render() {
		return (
			<Alert color={this.props.type}>
				{this.props.children}
			</Alert>
		)
	}
}

const handleColorType = color => {
	switch (color) {
		case "primary":
			return "#03a9f3";
		case "danger":
			return "#E57373";
		case "success":
			return "#81C784";
		case "warning":
			return "#ca6005";
		default:
			return "rgba(0,0,0,0.5)";
	}
};

const Alert = styled.div`
	padding: 7px 10px;
	border-radius: 3px;
	text-align: center;
	font-weight: bold;
	color: #fff;
	background-color: ${({color}) => handleColorType(color)};
`;