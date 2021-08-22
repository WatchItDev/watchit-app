import React from 'react'
import uid from 'shortid'
import styled from 'styled-components'
import FlowText from '../util-flow-text'

const ListCommaSplit = (props) => {
  return (
    <ListCommaWrapper>
      {
        props.list.map((splitter) => {
          return (
            <FlowText color='#607d8b' key={uid.generate()}>
              {splitter}
            </FlowText>
          )
        })
      }
    </ListCommaWrapper>
  )
}

export default React.memo(ListCommaSplit)

const ListCommaWrapper = styled.div`
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;

  span:not(:last-of-type)::after {
    content: ", "
  }
`
