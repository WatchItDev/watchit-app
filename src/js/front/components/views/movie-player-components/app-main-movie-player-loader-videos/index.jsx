import React from 'react'
import Particles from 'react-particles-js';
import config from './particleConfig'
import configText from './particleConfigText'

export default class AppMoviesPlayerLoader extends React.Component {

	shouldComponentUpdate() {
		return false
	}

	render() {
		return (
			<div className="particles_container">
				{/*<Particles width="100%" height="100%" params={config}/>*/}
				<Particles width="100%" height="100%" params={configText}/>
			</div>
		)
	}
}
