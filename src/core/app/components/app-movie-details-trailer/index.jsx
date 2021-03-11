import React from 'react'
// import PropTypes from 'prop-types'
import BoxLoader from 'components/util-box-loader'
import ReactPlayer from 'react-player';
import ReactModal from 'react-modal';
import styled from 'styled-components';

ReactModal.setAppElement('#root');
export default class AppMovieDetailTrailer extends React.PureComponent {
	
	constructor(props) {
		super(props);
		
		this.state = {
			ready_to_play: false
		}
		
		//Conf for modal
		this.modalStyle = {
			overlay: {
				position: 'fixed',
				top: 0, left: 0,
				right: 0, bottom: 0,
				backgroundColor: 'rgba(0, 0, 0, 0.8)'
			}, content: {
				position: 'absolute',
				top: '50%', left: '50%',
				right: 'auto', bottom: 'auto',
				transform: 'translate(-50%, -50%)',
				border: 'none', background: 'transparent',
				overflow: 'auto',
				WebkitOverflowScrolling: 'touch',
				borderRadius: '4px', outline: 'none',
				padding: '20px'
				
			}
		};
	}
	
	
	onReady = () => this.setState({
		ready_to_play: true
	})
	
	onClose = () => {
		this.props.onClose
		&& this.props.onClose()
	}
	
	render() {
		return <ReactModal isOpen={true} style={this.modalStyle}>
			{
				<Button
					onClick={this.onClose}>
					<ButtonIcon className="icon-cross"/>
				</Button>
			}
			{
				!this.state.ready_to_play &&
				<BoxLoader size={100}/>
			}
			
			<ReactPlayer
				onReady={this.onReady}
				url={`https://www.youtube.com/watch?v=${this.props.trailer}`}
				playing controls config={{youtube: {playerVars: {showinfo: 0, disablekb: 1}}}}
			/>
		</ReactModal>
	}
	
}

const Button = styled.button`
	border: none;
	position: absolute;
	right: 5px;
	top: 0;
	display: inline-block;
	color: #fff;
	overflow: hidden;
	z-index: 1;
	width: 37px;
	height: 37px;
	line-height: 37px;
	padding: 0;
	border-radius: 50%;
	cursor: pointer;
	vertical-align: middle;
	text-decoration: none;
	outline: 0;
	text-transform: uppercase;
	text-align: center;
	letter-spacing: .5px;
	transition: 0.2s ease-out;
	background-color: #FFFFFF;
`;

const ButtonIcon = styled.i`
	font-size: 1.6rem;
	line-height: inherit;
	color: #000000;
`;