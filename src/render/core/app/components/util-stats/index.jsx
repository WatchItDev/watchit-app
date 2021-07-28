import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const StatWrapper = styled.div`
  display: flex;
`

const StatContent = styled.div`
  display: inline-block;

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
  const _index = (i) => {
    return props.handler
      ? props.handler(i)
      : 0
  }

  const chunk = () => {
    return _index('chunk')
  }

  const getTotal = () => {
    return _index('total')
  }

  const getTmp = () => {
    return parseFloat(
      _index('tmp')
    ).toFixed(1)
  }

  const getPeers = () => {
    const _currentPeers = _index('peers')
    return _currentPeers > 0 ? _currentPeers : 1
  }

  const [peers, setPeers] = useState(getPeers())
  const [progress, setProgress] = useState(getTmp())
  const [loaded, setLoaded] = useState(chunk())
  const [total, setTotal] = useState(getTotal())

  useEffect(() => {
    const timer = setInterval(() => {
      setPeers(getPeers())
      setProgress(getTmp())
      setLoaded(chunk())
      setTotal(getTotal())
    }, 10000)

    return () => {
      if (timer) { clearInterval(timer) }
    }
  })

  return (
    <StatWrapper>
      <StatContent>
        <StatIcon className='icon-traffic-cone' />
        <StatText>Sync: {progress}%</StatText>
        <StatIcon className='icon-book' />
        <StatText>Movies: {loaded}/{total}</StatText>
        <StatIcon className='icon-user' />
        <StatText>Peers: {peers}</StatText>
      </StatContent>
      <LogOut onClick={props.onSignOut} href='/'>
        <LogOutIcon className='icon-log-out' />
      </LogOut>
    </StatWrapper>
  )
}

Stats.propTypes = {
  handler: PropTypes.func.isRequired,
  handleSignOut: PropTypes.func
}

export default React.memo(Stats)
