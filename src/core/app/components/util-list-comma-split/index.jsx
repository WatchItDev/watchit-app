import React from 'react'
import PropTypes from 'prop-types'
import uid from "shortid";
import styled from "styled-components";

export default class ListCommaSplit extends React.Component {
	shouldComponentUpdate() {
		return false;
	}
	
	static get propTypes() {
		return {
			list: PropTypes.array.isRequired
		}
	}
	
	render() {
		return (
			<SecondaryTitleContainer>
				{
					this.props.list.map((splitter) => {
						return (
							<span key={uid.generate()}>
                                {splitter}
                            </span>
						)
					})
				}
			</SecondaryTitleContainer>
		)
	}
}


const SecondaryTitleContainer = styled.div`
	margin: 20px 0;
	font-size: 1.8rem;
	width: 100%;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	font-weight: 300;
	word-break: break-all;
	padding: 0 0.75rem;
	color: #607d8b;
`;