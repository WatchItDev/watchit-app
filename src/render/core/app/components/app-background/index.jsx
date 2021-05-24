import React from 'react'
import styled from 'styled-components';
import Logo from 'components/util-header-logo/'

export default class Background extends React.Component {

	shouldComponentUpdate() {
		return false
	}

	static get defaultProps() {
		return {
			showLogo: true,
			absolute: true,
		}
	}

	render() {
		return (
			<BackgroundContainer absolute={this.props.absolute}>
				<Logo show={this.props.showLogo} thumbnail={true} absolute={this.props.absolute}/>
				<Slogan show={this.props.showLogo}>open movies everywhere</Slogan>
			</BackgroundContainer>
		)
	}
}

const BackgroundContainer = styled.div`
	height: ${props => props.absolute ? '100%' : 'auto'};
	width: ${props => props.absolute ? '100%' : 'auto'};
	display: flex;
	align-items: center;
	justify-content: center;
	${props => props.absolute ? 'absolute' : 'relative'}
	left: 0;
	top: 0;
`

const Slogan = styled.div`
	position: absolute;
	color: white;
	transform: translateY(-2rem);
	letter-spacing: 2px;
	font-size: 2rem;
	display: ${({show}) => show ? "inline-block" : "none"};
`
