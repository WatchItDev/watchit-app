import React from 'react'
import PropTypes from 'prop-types'
import PulseLoader from 'components/util-pulse-loader'
import gatewayHelper from 'core/resources/helpers/gateway'

const log = window.require("electron-log");
export default class BoxImage extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            status: 0,
            loaded: false,
            src: null
        };
    }


    static getDerivedStateFromProps(props) {
        return {
            src: props.src
        }
    }

    parseUriImage = (image) => {
        if (image) {
            // While load chunk of movies image = undefined
            // Check if valid param before
            return gatewayHelper.dummyParse(image)
        }
    }


    static get propTypes() {
        return {
            src: PropTypes.object.isRequired
        }
    }

    static get defaultProps() {
        return {
            preload: false,
        }
    }

    handleImageLoaded = (e, status = 1) => this.setState({status: status, loaded: true})
    handleImageError = () => {
        log.warn('Fail image request')
        log.warn('Retrying...')
        this.forceUpdate()
    }

    render() {
        return (
            <figure className="image-container no-margin">

                {
                    /*Spinner loader*/
                    !this.state.loaded &&
                    this.props.preload && <PulseLoader style={{top: '20rem'}}/>
                }

                <img alt={''} src={this.parseUriImage(this.state.src)}
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
