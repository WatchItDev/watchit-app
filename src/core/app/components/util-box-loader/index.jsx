import React from 'react'
import AudioLoader from 'media/img/spinner/audio.svg'
import styled from 'styled-components'

export default class BoxLoader extends React.PureComponent {

	static get defaultProps() {
		return {
			size: 83
		}
	}

	render() {
		return (
			<LoaderContainer>
				<img alt="" src={AudioLoader} {...this.props}/>
			</LoaderContainer>
		)
	}
}

const LoaderContainer = styled.div`
	position: absolute;
	height: calc(100% - 11rem);
	width: 100%;
	display: flex;
	left: 0;
	align-items: center;
	justify-content: center;
`;