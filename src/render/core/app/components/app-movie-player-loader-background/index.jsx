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
			absolute: true,
		}
	}

	render() {
		return (
			<ParticlesContainer absolute={this.props.absolute}>
				{/*<Particles width="100%" height="100%" params={config}/>*/}
				<Logo show={this.props.showLogo} big={true} absolute={this.props.absolute}/>
				<Slogan show={this.props.showLogo}>open movies everywhere</Slogan>
			</ParticlesContainer>
		)
	}
}

const ParticlesContainer = styled.div`
	height: ${props => props.absolute ? '100%' : 'auto'};
	width: ${props => props.absolute ? '100%' : 'auto'};
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
