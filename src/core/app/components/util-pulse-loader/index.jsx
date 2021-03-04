import React from 'react'
import styled, {keyframes} from 'styled-components'

export default class PulseLoader extends React.Component {
	
	shouldComponentUpdate() {
		return false
	}
	
	render() {
		return (
			<SpinnerContainer  {...this.props}>
				<SpinnerItem />
				<SpinnerItem delayed={true} />
			</SpinnerContainer>
		)
	}
}

const SpinnerContainer = styled.div`
	width: 40px;
	height: 40px;
	position: absolute;
	top: calc(50% - 20px);
	left: calc(50% - 20px);
`;

const Bounce = keyframes`
	0%, 100% {
		transform: scale(0.0);
		-webkit-transform: scale(0.0);
	}
	50% {
		transform: scale(1.0);
		-webkit-transform: scale(1.0);
	}
`;

const SpinnerItem = styled.div`
	width: 100%;
	height: 100%;
	border-radius: 50%;
	background-color: rgba(255, 255, 255, 0.5);
	opacity: 0.6;
	position: absolute;
	top: 0;
	left: 0;
	animation: ${Bounce} 1.5s infinite ease-in-out;
	animation-delay: ${({delayed}) => delayed ? -0.75 : 0}s;
`;