import React from 'react'
import styled from 'styled-components'

export default class AppNotifyAlert extends React.PureComponent {
	constructor(props) {
		super(props);
		// Initial state
		this.state = Object.assign({
			closeByUser: true, autoClose: false,
			closeTime: 20, percentage: 0,
			showed: false, delay: 1
		}, this.props);

		this.renderTimeout = null;
		this.closeTimer = null;
		this.showNotification = this.showNotification.bind(this);
		this.closeNotification = this.closeNotification.bind(this);
	}

	closeNotification() {
		this.setState({showed: false});
	}

	showNotification() {
		this.setState({showed: true});
	}

	setUpAutoClose() {
		let seconds = 0;
		this.closeTimer = setInterval(()=>{
			seconds += 1;
			let percentage = (seconds / this.state.closeTime) * 100;
			this.setState({percentage:percentage})
			if (percentage >= 100) {
				clearInterval(this.closeTimer);
				this.closeNotification()
			}
		},  1000);
	}

	componentDidMount() {
		this.renderTimeout = setTimeout(()=>{
			this.showNotification();
		}, this.state.delay * 1000);

		if (this.state.autoClose) this.setUpAutoClose();
	}

	render() {
		return <NotificationWrapper show={this.state.showed}>
			<ProgressBar percentage={this.state.percentage} />
			<NotificationHeader>
				<span>Notification</span>
				{
					this.state.closeByUser &&
					<Close className="icon-cross" onClick={this.closeNotification}/>
				}
			</NotificationHeader>
			{this.props.children}
		</NotificationWrapper>
	}
}

const NotificationWrapper = styled.div`
	position: fixed;
	bottom: 20px;
	left: ${props => props.show ? 20 : -500}px;
	width: auto;
	padding: 1rem;
	border-radius: 5px;
	background-color: rgba(0,0,0,0.9);
	box-shadow: 5px 6px 8px 0 rgba(0, 0, 0, 0.7);
	z-index: 10000;
	max-width: 20rem;
	font-size: 0.9rem;
	color: #eee;
	transition: all 0.2s ease-in-out;
	
	p, img, span {
		margin: 0.25rem 0;
	}
	
	img {
		height: auto;
		width: 100%;
		border-radius: 5px;
	}
	
	footer {
		display: flex;
		margin: 1rem 0 0;
		
		button {
			flex-grow: 1;
			margin: 0 0.25rem;
			color: white;
			background-color: #353c39;
			border-radius: 5px;
			appearance: none;
			box-shadow: none;
			-webkit-appearance: none;
			border: none;
			height: 35px;
			font-weight: 600;
			font-size: 0.9rem;
		}
	}
`;

const NotificationHeader = styled.header`
	color: rgb(229, 142, 38);
	font-weight: 600;
	font-size: 1.1rem;
	line-height: 1;
	margin-bottom: 0.7rem;
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

const ProgressBar = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	height: 2px;
	width: ${props => props.percentage}%;
	background-color: #26a69a;
	transition: all 0.2s ease-in-out;
`;

const Close = styled.i`
	font-size: 1.5rem;
	line-height: 1rem;
	color: white;
	cursor: pointer;
`;
