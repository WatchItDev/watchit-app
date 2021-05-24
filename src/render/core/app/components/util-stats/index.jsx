import React from 'react'
import PropTypes from 'prop-types'

export default class Stats extends React.PureComponent {
  constructor (props) {
    super(props)
    this.timer = null
    this.state = {
      peers: this.peers,
      mainProgress: this.tmp,
      loadedMovies: this.chunk,
      totalMovies: this.total,
    }

  }

  componentDidMount () {
    this.timer = setInterval(() => {
      this.setState({
        peers: this.peers,
        mainProgress: this.tmp,
        loadedMovies: this.chunk,
        totalMovies: this.total
      })
    }, 10000)
  }

  get loaded () {
    return this._index('chunk') > 0
  }

  get cached () {
    return this._index('cached')
  }

  componentWillUnmount () {
    if (this.timer)
      clearInterval(this.timer)
  }

  _index (i) {
    return this.props.handler ?
      this.props.handler(i) : 0
  }

  get chunk () {
    return this._index('chunk')
  }

  get total () {
    return this._index('total')
  }

  get tmp () {
    return parseFloat(
      this._index('tmp')
    ).toFixed(1)
  }

  get peers () {
    let _currentPeers = this._index('peers')
    return _currentPeers > 0 ? _currentPeers : 1
  }

  static get propTypes () {
    return {
      handler: PropTypes.func.isRequired
    }
  }

  render () {
    return <>
      <span className="icon-traffic-cone icon"/>
      <span>${this.tmp}%: Sync</span>
      <span className="icon-book icon"/>
      <span>${this.chunk}/{this.total}: Movies</span>
      <span className="icon-user icon"/>
      <span>${this.peers}: Peers</span>
    </>

  }
}

