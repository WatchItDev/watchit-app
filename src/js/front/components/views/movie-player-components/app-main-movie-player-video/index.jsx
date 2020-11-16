import React from 'react'


export default class AppMoviesPlayerVideo extends React.PureComponent {
	constructor(props) {
		super(props);
		this.video = null;
	}
	
	getRef = (node) => {
		this.video = node
	}
	
	render() {
		return <video
			ref={this.getRef}
			src={this.props.src} autoPlay={true} controls={true}
			className="vjs-theme-city video-js full-width full-height"
		/>
	}
}
