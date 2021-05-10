import React from 'react'
import PointsLoader from 'components/util-points-loader'
import styled from 'styled-components';

export default class BoxButton extends React.Component {
	static get defaultProps() {
		return {
			clicked: false,
			type: 'button'
		}
	}

	render() {
		return (
			<Button type={this.props.type} onClick={this.props.onClick}>
				{
					/*show loader on submit*/
					((Object.is(this.props.type, "submit") || this.props.forceLoader)
						&& this.props.clicked && <PointsLoader/>) || this.props.children
				}
			</Button>
		)
	}
}

const Button = styled.button`
	width: 100%;
	text-decoration: none;
	color: #fff;
	background-color: #26a69a;
	text-align: center;
	letter-spacing: .5px;
	border: none;
	border-radius: 2px;
	height: 36px;
	cursor: pointer;
	line-height: 36px;
	outline: 0;
	padding: 0 2rem;
`;