import React from 'react'
import PropTypes from 'prop-types'
import PulseLoader from 'components/util-pulse-loader/'
import styled from "styled-components";

export default class BoxImage extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            status: 0,
            loaded: false
        };
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
            <ImageContainer>

                {
                    /*Spinner loader*/
                    !this.state.loaded &&
                    this.props.preload && <PulseLoader style={{top: '20rem'}}/>
                }

                <Image alt={''} src={this.props.src}
                     onLoad={this.handleImageLoaded}
                     onError={this.handleImageError}
                     loaded={
                         !(this.state.status < 0 && this.props.preload)
                         && (this.state.loaded || !this.props.preload)
                     }
                />
            </ImageContainer>
        )
    }
}

const ImageContainer = styled.figure`
  margin: 0;
  width: 100%;
  height: auto;
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  max-width: 100%;
  position: relative;
  border: 0;
  border-radius: 0.5rem;
  transition: all 1.5s ease-in-out;
  opacity: ${props => props.loaded ? 1 : 0};
`;
