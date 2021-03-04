import React from 'react'
import BoxImage from 'components/app-image'
import gatewayHelper from "resource/helpers/gatewayHelper";
import styled from "styled-components";

export default class AppMainSearchResultBoxItem extends React.PureComponent {

    onClick = (e)=>{
        this.props.onClick && this.props.onClick(this.props._id);
    };

    parseUriImage = (image) => {
        if (image) {
            // While load chunk of movies image = undefined
            // Check if valid param before
            return gatewayHelper.dummyParse(image)
        }
    }

    render() {
        return (
            <Container onClick={this.onClick}>
                <ImageContainer>
                    <BoxImage src={this.parseUriImage(this.props.image)} placeholder={{w: 60, h: 90}}/>
                </ImageContainer>
                <Content>
                    <Title>
                        {this.props.title}
                    </Title>
                    <InfoContainer>
                        <Item color="success">
                            <Icon className="icon-calendar"/>
                            {this.props.year}
                        </Item>
                        <Item color="warning">
                            <Icon className="icon-star"/>
                            {this.props.rating}
                        </Item>
                        <Item color="danger">
                            <Icon className="icon-back-in-time"/>
                            {this.props.runtime}
                        </Item>
                    </InfoContainer>
                </Content>
            </Container>
        )
    }
}

const Container = styled.div`
  background: transparent;
  line-height: 1.5rem;
  margin: 0;
  cursor: pointer;
  border: none;
  padding: 5px;
  display: flex;
  list-style-type: none;
`;

const Content = styled.div`
  margin-left: 1rem;
  max-width: calc(100% - 3rem);
  flex-grow: 1;
`;

const Title = styled.strong`
  display: -webkit-box !important;
  -webkit-line-clamp: 2;
  white-space: pre-wrap;
  -webkit-box-orient: vertical;
  height: auto;
  overflow: hidden;
  text-overflow: ellipsis;
  font-style: normal !important;
  font-size: 1.2rem;
  word-break: break-all;
  color: #fff;
  font-weight: 500;
`;

const InfoContainer = styled.div`
  margin-top: 5px;
  display: flex;
`;

const handleColorType = color => {
    switch (color) {
        case "primary":
            return "#03a9f3";
        case "danger":
            return "#F44336";
        case "success":
            return "#4CAF50";
        case "warning":
            return "#ff9800";
        default:
            return "#fff";
    }
};

const Item = styled.div`
    margin-right: 1rem;
	color: ${({color}) => handleColorType(color)};
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Icon = styled.div`
    margin-right: 0.2rem;
    font-size: 1rem;
`;

const ImageContainer = styled.div`
    width: 3rem;
    height: auto;
`;