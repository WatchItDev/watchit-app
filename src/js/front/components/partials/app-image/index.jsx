import React from 'react'
import PropTypes from 'prop-types'
import PulseLoader from 'js/front/components/generic/util-pulse-loader'

export default class BoxImage extends React.PureComponent {

    constructor(props) {
        super(props);
        this.gateway = window.Gateway
        this.state = {
            status: 0,
            loaded: false
        };
    }

    get fullUri() {
        return this.gateway.parse(
            this.props.src
        )
    }


    static get propTypes() {
        return {
            src: PropTypes.string.isRequired
        }
    }

    static get defaultProps() {
        return {
            preload: false,
        }
    }

    handleImageLoaded = (e, status = 1) => this.setState({status: status, loaded: true})
    handleImageError = () => this.setState({status: -1})

    render() {
        return (
            <figure className="image-container no-margin">

                {
                    /*Spinner loader*/
                    !this.state.loaded &&
                    this.props.preload && <PulseLoader style={{top: '20rem'}}/>
                }

                <img alt={''} src={this.fullUri}
                     onLoad={this.handleImageLoaded}
                     onError={this.handleImageError}
                     className={this.state.status < 0 && this.props.preload ? "hidden" :
                         (this.state.loaded || !this.props.preload) ?
                             "loaded-img responsive-img" : "locked-img invisible"
                     }
                />
            </figure>
        )
    }
}
