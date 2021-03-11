import React from 'react'
import PropTypes from "prop-types";
import styled from "styled-components";


export default class NavBarButton extends React.Component {
	
	shouldComponentUpdate(nextProps, nextState, nextContext) {
		return !Object.is(nextProps.link.href, this.props.link.href)
	}
	
	static get defaultProps() {
		return {
			mrb: 5, link: {}
		}
	}
	
	static get propTypes() {
		return {
			text: PropTypes.string.isRequired,
			icon: PropTypes.string.isRequired
		}
	}
	
	preventDefault(e) {
		e.preventDefault()
	}
	
	render() {
		return (
			<List>
				<ListItem>
					<ListItemLink {...this.props.link}>
						<ListItemLinkIcon className={`${this.props.icon}`}/>
						<span>{this.props.text}</span>
					</ListItemLink>
				</ListItem>
			</List>
		)
	}
}

const List = styled.ul`
	list-style-type: none;
	padding: 0;
	margin: 0;
`;

const ListItem = styled.li`
	list-style-type: none;
`;

const ListItemLink = styled.a`
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	padding: 0 15px;
	font-size: 1.2rem;
	line-height: 1.2rem;
	color: #fff;
	
	&:hover {
		background-color: rgba(0, 0, 0, 0.1);
	}
`;

const ListItemLinkIcon = styled.i`
	margin-right: 5px;
`;