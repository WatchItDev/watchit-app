import React from 'react'
import PropTypes from 'prop-types'
import PulseLoader from 'components/util-pulse-loader'
import gatewayHelper from 'render/core/resources/helpers/gateway'

const log = window.require("electron-log");
export default class BoxImage extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            loaded: false
        };
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

    handleImageLoaded = () => {
        this.setState({loaded: true})

    }

    handleImageError = () => {
        log.warn('Fail image request')
        log.warn('Retrying...')
        if (!this.state.loaded) return this.forceUpdate()
        this.setState({loaded: false})

    }

    render() {
        return (
            <figure className="image-container no-margin">
                {!this.state.loaded && this.props.preload && <PulseLoader style={{top: '20rem'}}/>}
                <img alt={''} src={this.parseUriImage(this.props.src)}
                     onLoad={this.handleImageLoaded}
                     onError={this.handleImageError}
                     className={(this.state.loaded || !this.props.preload) ?
                         "loaded-img responsive-img" : "locked-img invisible"
                     }
                />
            </figure>
        )
    }
}
