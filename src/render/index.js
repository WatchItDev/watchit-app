// eslint-disable-next-line
import 'v8-compile-cache'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './core/app'

import 'normalize.css'
import 'plyr/src/sass/plyr.scss'
import './index.sass'

const root = document.getElementById('root')
ReactDOM.render(<App />, root)

// LISTENERS
const preventDefault = (e) => e.preventDefault()
// Prevent dropping files into the window
window.addEventListener('dragover', preventDefault, false)
window.addEventListener('drop', preventDefault, false)
// Prevent dragging files outside the window
window.addEventListener('dragstart', preventDefault, false)
// Avoid right click
document.addEventListener('contextmenu', preventDefault, false)
// Prevent default reload, devtools
document.addEventListener('keydown', (e) => {
  const keyCode = !window.event ? (e.which || e.keyCode) : window.event.keyCode
  const avoidReload = (e.ctrlKey && keyCode === 82 && process.env.NODE_ENV !== 'development')
  // this code handles the F5/Ctrl+F5/Ctrl+R
  if (keyCode === 116 || avoidReload) { e.preventDefault() }
  if (keyCode === 122 || keyCode === 123) { e.preventDefault() }
})
