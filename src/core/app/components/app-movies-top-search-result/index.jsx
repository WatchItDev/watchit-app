import React from 'react'
import AppMainResultBox from 'components/app-movies-top-search-result-box/'
import PointsLoader from 'components/util-points-loader'
import CustomScrollbars from 'components/util-scroller';
import styled from 'styled-components';

export default class AppMainSearchResult extends React.Component {

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return !Object.is(nextProps.searching, this.props.searching) ||
            !Object.is(nextProps.result.length, this.props.result.length)
    }

    render() {
        return (
            <Container>
                {
                    (this.props.searching &&
                        <LoaderContainer>
                            <PointsLoader/>
                        </LoaderContainer>
                    ) ||
                    <CustomScrollbars
                        autoHide
                        autoHeight
                        autoHeightMax={500}
                        autoHideTimeout={1000}
                        autoHideDuration={200}
                        thumbMinSize={30}
                        universal={true}>
                        {
                            (this.props.result.length > 0 &&
                                <ResultsContainer>
                                    <ResultsList>
                                        {(
                                            this.props.result.map((i) => {
                                                return (
                                                    <AppMainResultBox
                                                        key={i._id} {...Object.assign(i, {image: i.small_image})}
                                                        onClick={this.props.onClick}
                                                    />
                                                )
                                            })
                                        )}
                                    </ResultsList>
                                </ResultsContainer>) || <NotFound>No results were found</NotFound>
                        }
                    </CustomScrollbars>
                }
            </Container>
        )
    }
}

const Container = styled.div`
  position: absolute;
  width: 100%;
  z-index: 100;
  top: 100%;
  left: 0;
`;

const LoaderContainer = styled.div`
  width: 100%;
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.9);
  text-align: center;
  padding: 10px;
`;

const ResultsContainer = styled.div`
  width: 100%;
  padding: 0 0.75rem;
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.9);
`;

const ResultsList = styled.ul`
  margin: 0 0 1rem 0;
  border-radius: 2px;
  overflow: hidden;
  position: relative;
  border: none;
  padding: 0;
  list-style: none;
`;

const NotFound = styled.span`
  width: 100%;
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.9);
  text-align: center;
  padding: 10px;
`;







