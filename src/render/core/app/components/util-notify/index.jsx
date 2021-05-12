import React from 'react'
import styled from 'styled-components'

export default class AppNotifyAlert extends React.PureComponent {
	render() {
		return <NotificationWrapper>

			<NotificationHeader>
				Notification
			</NotificationHeader>
			{this.props.children}
		</NotificationWrapper>
	}
}

const NotificationWrapper = styled.div`
	position: fixed;
	bottom: 20px;
	left: 20px;
	width: auto;
	padding: 1rem;
	border-radius: 5px;
	background-color: rgba(0,0,0,0.9);
	box-shadow: 5px 6px 8px 0 rgba(0, 0, 0, 0.7);
	z-index: 10000;
	max-width: 50%;
	font-size: 0.9rem;
	color: #eee;
`;

const NotificationHeader = styled.header`
	color: rgb(229, 142, 38);
	font-weight: 600;
	font-size: 1.1rem;
	line-height: 1;
	margin-bottom: 0.7rem;
`;

const progressBar = styled.header`
	
`;
