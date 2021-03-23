import React from 'react'


export default class AppMoviesPlayerVideo extends React.PureComponent {
    constructor(props) {
        super(props);
        this.video = null;
    }

    static get defaultProps() {
        return {
            type: ""
        }
    }

    getRef = (node) => {
        this.video = node
    }

    render() {
        return <video
            ref={this.getRef} autoPlay={false} controls={true} playsInline={true}
            className="vjs-theme-city video-js full-width full-height">
            <source ref={'source'} type={this.props.type} src={this.props.src}/>
        </video>
    }
}
