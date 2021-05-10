import React from 'react'

export default class Transition extends React.Component {
    constructor(props) {
        super(props);

        this.animationSeconds = 3;
        this.state ={ //base css
            show: true,
            style :{
                opacity: 0,
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                zIndex: 1000,
                transition: `all ${this.animationSeconds}s ease`,
            }
        }
    }

    componentWillReceiveProps(newProps,nextContext) { // check for the mounted props
        if(!newProps.mounted)
            return this.unMountStyle(); // call outro animation when mounted prop is false
        this.setState({ // remount the node when the mounted prop is true
            show: true
        });
        this.timeout = setTimeout(this.mountStyle, 10) // call the into animation
    }

    componentDidMount(){
        this.timeout = setTimeout(this.mountStyle, 10) // call the into animation
    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
    }

    unMountStyle = () => { // css for unmount animation
        this.setState({
            style: {
                opacity: 0,
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                zIndex: 1000,
                transition: `all ${this.animationSeconds}s ease`,
            }
        })
    };

    mountStyle = () => { // css for mount animation
        this.setState({
            style: {
                opacity: 1,
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                zIndex: 1000,
                transition: `all ${this.animationSeconds}s ease`,
            }
        })
    };

    transitionEnd = () => {
        if(!this.props.mounted){ // remove the node on transition end when the mounted prop is false
            this.setState({
                show: false
            })
            clearTimeout(this.timeout);
        }
    };

    render() {
        console.log(this.state.show);
        console.log(this.props.forceShow);

        return <div className={"just-transition"} style={this.state.style} onTransitionEnd={this.transitionEnd}>
                {(this.props.mounted || this.props.forceShow) && this.props.children}
            </div>
    }
}