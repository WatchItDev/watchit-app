import React, { useState, useEffect } from 'react'
import Logo from 'components/app-logo/'
import styled from 'styled-components'
import settings from 'settings'

const electron = require('electron')
const ipcRenderer = electron.ipcRenderer
const UPDATER_EVENT = 'update-available'
const DEFAULT_UPDATER_MESSAGE = 'A new update is available. The app it is being updated and will restart on completion...'

const Container = styled.section`
  position: absolute;
  height: 100%;
  width: 100%;
`

const Header = styled.header`
  -webkit-app-region: drag;
  z-index: 1000;
  position: relative;
  top: 0;
  right: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.8);
  padding: 1rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (min-width: 300px) {
    height: 3.5rem;
  }

  @media (min-width: 992px) {
    height: 4rem;
  }

  @media (min-width: 2000px) {
    height: 6rem;
  }
`

const WindowControls = styled.ul`
  -webkit-app-region: no-drag;
  position: relative;
  align-items: center;
  display: flex;
  margin: 0;
  padding: 0;
  list-style-type: none;
`

const WindowControl = styled.li`
  margin-right: 4px;
  align-items: center;
  display: flex;
  list-style-type: none;
  text-align: -webkit-match-parent;
`

const WindowControlIcon = styled.i`
  font-size: 1rem;
  color: ${props => props.color};
  cursor: pointer;
  
  @media (min-width: 300px) {
    font-size: 1.1rem
  }

  @media (min-width: 992px) {
    font-size: 1.2rem
  }

  @media (min-width: 2000px) {
    font-size: 2rem;
  }
`

const DragBar = (props) => {
  // eslint-disable-next-line
  const [_, setUpdater] = useState('')

  const updateOnlineStatus = () => {
    ipcRenderer.send('online-status-changed',
      navigator.onLine
    )
  }

  useEffect(() => {
    // TODO add updater box
    ipcRenderer.on(UPDATER_EVENT, () => setUpdater(DEFAULT_UPDATER_MESSAGE))
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)
    return () => {
      ipcRenderer.removeAllListeners(UPDATER_EVENT)
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  })

  const closeWin = () => {
    ipcRenderer.send('close')
  }

  const minimizeWin = () => {
    ipcRenderer.send('minimize')
  }

  const maximizeWin = () => {
    ipcRenderer.send('maximize')
  }

  return (
    <Container>
      <Header>
        <Logo />
        {/* {this.state.updater && <Updater>{this.state.updater}</Updater>} */}
        <WindowControls>
          <WindowControl onClick={(e) => minimizeWin(e)}>
            <WindowControlIcon className='icon-circle-with-minus' color={settings.styles.colors.warningIntense} />
          </WindowControl>
          <WindowControl onClick={(e) => maximizeWin(e)}>
            <WindowControlIcon className='icon-circle-with-plus' color={settings.styles.colors.successIntense} />
          </WindowControl>
          <WindowControl onClick={(e) => closeWin(e)}>
            <WindowControlIcon className='icon-circle-with-cross' color={settings.styles.colors.dangerIntense} />
          </WindowControl>
        </WindowControls>
      </Header>
      {props.children}
    </Container>
  )
}

export default React.memo(DragBar)
