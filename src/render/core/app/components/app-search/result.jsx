import React from 'react'
import PointsLoader from '@components/util-points-loader'
import CustomScrollbars from '@components/util-scroller'
import styled from 'styled-components'

import SearchResultItem from './result.item'

const ResultsWrapper = styled.div`
  width: 100%;
  position: absolute;
  z-index: 100;
  left: 0;
  top: 100%;
  border-radius: 5px;
  overflow: hidden;
`

export const ResultsContent = styled.div`
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.9);
  width: 100%;
`

const ResultsCollection = styled.ul`
  margin: 0.5rem 0 1rem 0;
  border-radius: 2px;
  overflow: hidden;
  position: relative;
  list-style-type: none;
  padding: 0;
  border: none;
`

const ResultsEmpty = styled.ul`
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.9);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`

export const NoResultsText = styled.span`
  font-weight: bold;
  color: #fff;
  font-size: 1rem;
`

const SearchResult = (props) => {
  return (
    <ResultsWrapper>
      {
        (props.searching &&
          <ResultsEmpty>
            <PointsLoader />
          </ResultsEmpty>
        ) ||
          <CustomScrollbars
            autoHide
            autoHeight
            autoHeightMax={500}
            autoHideTimeout={1000}
            autoHideDuration={200}
            thumbMinSize={30}
            universal
          >
            {
            (props.result?.length > 0 &&
              <ResultsContent>
                <ResultsCollection>
                  {(
                    props.result.map((i) => {
                      return (
                        <SearchResultItem
                          key={i._id} {...Object.assign(i, { image: i.resource.posters.small })}
                          onClick={props.onClick}
                        />
                      )
                    })
                  )}
                </ResultsCollection>
              </ResultsContent>
            ) ||
              <ResultsEmpty>
                <NoResultsText>No results were found</NoResultsText>
              </ResultsEmpty>
          }
          </CustomScrollbars>
      }
    </ResultsWrapper>
  )
}

export default React.memo(SearchResult)
