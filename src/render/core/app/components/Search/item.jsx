import React from 'react'
import Image from '@components/Image/'
import styled from 'styled-components'
import setting from '@settings'

const ResultWrapper = styled.li`
  display: flex;
  background-color: transparent;
  list-style-type: none;
  line-height: 1.5rem;
  padding: 10px 20px;
  margin: 0;
  border-bottom: 1px solid rgba(53, 60, 57, 0.4);
  cursor: pointer;
`

const ResultContent = styled.div`
  margin-left: 1rem;
  max-width: calc(100% - 3rem);
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`

const ResultTitle = styled.strong`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  white-space: pre-wrap;
  -webkit-box-orient: vertical;
  height: auto;
  overflow: hidden;
  text-overflow: ellipsis;
  font-style: normal;
  font-size: 1.2rem;
  word-break: break-all;
  color: #FFF;
  font-weight: 500;
`

const ResultDetails = styled.div`
  margin-top: 0.4rem;
`

const ResultDetailsItem = styled.span`
  font-size: 1rem;
  margin-right: 1rem;
  color: ${props => props.color};
`
const ResultDetailsItemIcon = styled.i`
  font-size: 1rem;
  margin-right: 0.3rem;
  color: ${props => props.color};
`

const ImageWrapper = styled.figure`
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
    width: 2.5rem;
    -webkit-transition: all 0.65s ease;
    transition: all 0.65s ease;
`

const SearchResultItem = (props) => {
  const handleClick = () => {
    props.onClick &&
    props.onClick(props._id)
  }

  return (
      <ResultWrapper onClick={handleClick}>
        <ImageWrapper className="slide-in-right">
          <Image src={props.image} preload pulseStyle={{position: 'relative'}}/>
        </ImageWrapper>
        <ResultContent>
          <ResultTitle>
            {props.meta.title}
          </ResultTitle>
          <ResultDetails>
            <ResultDetailsItem color={setting.styles.colors.successDark}>
              <ResultDetailsItemIcon className='icon-calendar'/>
              {props.meta.year}
            </ResultDetailsItem>
            <ResultDetailsItem color={setting.styles.colors.warningDark}>
              <ResultDetailsItemIcon className='icon-star'/>
              {props.meta.rating}
            </ResultDetailsItem>
            <ResultDetailsItem color={setting.styles.colors.dangerDark}>
              <ResultDetailsItemIcon className='icon-back-in-time'/>
              {props.meta.runtime} m
            </ResultDetailsItem>
          </ResultDetails>
        </ResultContent>
      </ResultWrapper>
)
}

export default React.memo(SearchResultItem)
