import React from 'react'
import styled from 'styled-components'

export default class MainHeader extends React.Component {

    shouldComponentUpdate() {
        return false
    }

    static get defaultProps() {
        return {
            action: '#/app/movies'
        }
    }

    render() {
        return (
            <Header>
                <HeaderTitle>
                    {
                        this.props.icon &&
                        <HeaderTitleIcon className={`${this.props.icon}`}/>
                    }
                    <span>{this.props.text}</span>
                </HeaderTitle>
                <a href={this.props.action} onClick={this.props.onClick}>
                    <HeaderLinkIcon className="icon-cross"/>
                </a>
            </Header>
        )
    }
}

const Header = styled.header`
  padding: 1rem 1.5rem;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderTitle = styled.h5`
  font-weight: bold;
  color: white;
  display: flex;
  align-items: center;
`;

const HeaderTitleIcon = styled.i`
  margin-right: 1rem
`;

const HeaderLinkIcon = styled.i`
  font-size: 45px;
  color: white;
`;