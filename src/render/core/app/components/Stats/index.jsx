import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const StatWrapper = styled.div`
  display: flex;
`

const StatContent = styled.div`
  display: inline-block;
  margin-right: 0.5rem;

  @media (max-width: 800px) {
    display: none;
  }
`

const StatIcon = styled.i`
  margin: 0 0.5rem 0 1.2rem;
  transform: translateY(1px);
  display: inline-block;
  font-size: 1rem;
  color: #fff;
`

const StatText = styled.span`
  font-size: 1rem;
  color: #fff;
`

const LogOut = styled.a`
  padding: 0 1rem 0 2rem;
  cursor: pointer;
`

const LogOutIcon = styled.i`
  font-size: 1rem;
  color: #fff;
`

const Stats = (props) => {

  return (
    <StatWrapper>
      <StatContent>
        <StatIcon className='icon-book' />
        <StatText>Movies: {props.loaded}/{props.count}</StatText>
      </StatContent>
    </StatWrapper>
  )
}

Stats.propTypes = {
  loaded: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
  handleSignOut: PropTypes.func
}

export default React.memo(Stats)
