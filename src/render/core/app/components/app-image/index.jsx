import React from 'react'
import PropTypes from 'prop-types'
import PulseLoader from 'components/util-pulse-loader'
import gatewayHelper from 'helpers/gateway'
import log from 'logger'

export default class BoxImage extends React.PureComponent {

    constructor(props) {
        super(props);
        this.img = null
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
            pulseStyle: null
        }
    }

    handleImageLoaded = () => {
        this.setState({loaded: true})
    }


    componentWillUnmount() {
        this.img.src = "" // Abort
    }

    handleImageError = () => {
        log.warn('Fail image request')
        log.warn('Retrying...')
        this.setState({loaded: false})
        this.forceUpdate()

    }

    getRef = (i) => {
        this.img = i
    }

    render() {
        return (
            <figure className="image-container no-margin">
                {
                    // Pulse loader
                    !this.state.loaded &&
                    this.props.preload &&
                    <PulseLoader style={this.props.pulseStyle}/>
                }
                <img alt={''} src={this.parseUriImage(this.props.src)}
                     onLoad={this.handleImageLoaded} loading={"lazy"}
                     onError={this.handleImageError} ref={this.getRef}
                     className={(this.state.loaded || !this.props.preload) ?
                         "loaded-img responsive-img" : "locked-img invisible"
                     }
                />
            </figure>
        )
    }
}
