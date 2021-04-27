import React from 'react'
import PropTypes from 'prop-types'


export default class AppMoviesPlayerSwarm extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            dSpeed: 0.0, uSpeed: 0.0,
            dLoaded: 0, fSize: 0,
            aPeers: 0
        }
    }


    static get propTypes() {
        return {
            flix: PropTypes.object.isRequired
        }
    }

    componentWillUnmount() {
        if (this.timeout)
            clearTimeout(this.timeout);
    }

    componentDidMount() {
        let flix = this.props.flix;
        //Interval to check for swarm info
        this.timeout = setInterval(() => {
            this.setState({
                dSpeed: (flix.swarm.downloadSpeed() / 1024).toFixed(2),
                uSpeed: (flix.swarm.uploadSpeed() / 1024).toFixed(2),
                dLoaded: parseInt(((flix.swarm.cachedDownload + flix.swarm.downloaded) / 1024) / 1024, 10),
                fSize: parseInt((flix.fileSize / 1024) / 1024, 10),
                aPeers: (flix.swarm.wires.filter(function (w) {
                    return !w.peerChoking
                }).length).toString()

            })
        }, 1000);
    }


    render() {
        return (
            (
                <ul>
                    <li className="white-text">
                        <span className="bold">
                            <i className={'icon-network margin-right-5'}/>
                        </span>
                        <span className={
                            this.state.aPeers <= 10 ?
                                "red-text" : this.state.aPeers < 15 && this.state.aPeers > 10 ?
                                "orange-text" : "green-text"
                        }>
                            {this.state.aPeers} peers
                        </span>
                    </li>
                    <li className="white-text">
                         <span className="bold">
                            <i className={'icon-arrow-bold-down margin-right-5'}/>
                        </span>
                        <span
                            className={
                                parseInt(this.state.dSpeed) <= 100 || this.state.dLoaded > this.state.fSize ?
                                    "red-text" : this.state.dSpeed < 250 && this.state.dSpeed > 100 ?
                                    "orange-text" : "green-text"
                            }>
                            {(this.state.dLoaded > this.state.fSize
                                && 0.00) || this.state.dSpeed} kb/s
                        </span>
                        <span className={'bold'}> / </span>
                        <span className="bold">
                            <i className={'icon-arrow-bold-up margin-right-5'}/>
                        </span>
                        <span className={this.state.uSpeed <= 50 ?
                            "red-text" : this.state.uSpeed < 100 && this.state.uSpeed > 50 ?
                                "orange-text" : "green-text"
                        }>
                            {this.state.uSpeed} kb/s
                        </span>


                    </li>

                    <li className="white-text">
                        <span className="bold">
                            <i className={'icon-download margin-right-5'}/>
                        </span>
                        <strong>{this.state.dLoaded > this.state.fSize ? this.state.fSize : this.state.dLoaded}MB</strong>
                        <span> of </span>
                        <strong>{this.state.fSize} MB</strong>
                    </li>
                </ul>
            )
        )
    }
}
