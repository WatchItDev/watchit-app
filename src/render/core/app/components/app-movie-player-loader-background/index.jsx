import React from 'react'
// import Particles from 'react-particles-js';
import styled from 'styled-components';
// import config from './particleConfig'
import Logo from 'components/util-header-logo'

export default class AppLoaderBackground extends React.Component {

	shouldComponentUpdate() {
		return false
	}

	static get defaultProps() {
		return {
			showLogo: true,
			absolute: false,
		}
	}

	render() {
		return (
			<ParticlesContainer absolute={this.props.absolute}>
				{/*<Particles width="100%" height="100%" params={config}/>*/}
				<Logo show={this.props.showLogo} big={true} absolute={true}/>
				<Slogan show={this.props.showLogo}>watch movies for free</Slogan>
			</ParticlesContainer>
		)
	}
}

const ParticlesContainer = styled.div`
	height: 100%;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	${props => props.absolute ? 'absolute' : 'relative'}
	left: 0;
	top: 0;

	#tsparticles {
		width: 100%;
		height: 100%;
	}
`

const Slogan = styled.div`
	position: absolute;
	color: white;
	transform: translateY(-2rem);
	letter-spacing: 2px;
	font-size: 2rem;
	display: ${({show}) => show ? "inline-block" : "none"};
`
