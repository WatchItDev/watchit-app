import React from 'react'
import styled from 'styled-components'

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;
const webFrame = electron.webFrame;

export default class AppMainUpdater extends React.PureComponent {
	constructor(props) {
		super(props);
		this.nRef = null;
		this.mRef = null;
		this.state = {
			show: false
		};
	}
	
	componentDidMount() {
		// Clear old cache on render
		// Restart listeners
		// Check for updates
		webFrame.clearCache();
		console.log('Requesting update');
		ipcRenderer.removeAllListeners('update_available');
		ipcRenderer.send('check_update'); // Check for update
		ipcRenderer.on('update_available', () => {
			this.mRef.innerText = 'A new update is available. The app it is being updated and will restart on completion...';
			this.setState({show:true})
		});
		
	}
	
	
	getMRef = (r) => {
		this.mRef = r
	}
	
	getNRef = (r) => {
		this.nRef = r
	}
	
	render() {
		return <UpdateContainer ref={this.getNRef} show={this.state.show}>
			<p ref={this.getMRef}>Checking updates..</p>
		</UpdateContainer>
	}
}

const UpdateContainer = styled.div`
	position: fixed;
	bottom: 20px;
	left: 20px;
	width: auto;
	padding: 20px;
	border-radius: 5px;
	background-color: white;
	box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
	z-index: 10000;
	display: ${props => props.show ? 'block' : 'none'};
`;