/* global localStorage */
import React from 'react'
import StateLoader from '@components/PlayerLoader/'
import Stats from '@components/Stats/'
import BoxLoader from '@components/BoxLoader/'
import Search from '@components/Search'

import CatalogList from './list'
import CatalogNav from './nav'

import storage from '@helpers/storage'
import util from '@helpers/util'
import log from '@logger'

// Access to main process bridge prop
import { Broker as broker, DB } from '@main/bridge'

const DEFAULT_INIT_LOAD = 50

// Login pages class
export default class Catalog extends React.Component {
  constructor(props) {
    super(props)
    // It cached or loaded initial chunk
    const itCached = this.cached || this.loaded
    log.warn(`Init with cached:${!!this.cached} and loaded:${!!this.loaded}`)
    // bafkreiegiu74bzxm4hneylxgthjpb74c5vxanee6nzbnot72fvbgt2p6ey
    // Initial state
    this.state = {
      state: 'Bootstrapping',
      percent: 0,
      peers: this.peers,
      count: DEFAULT_INIT_LOAD,
      ready: itCached,
      loading: !itCached,
      movies: [],
      selectedCollection: this.props.cid,
      screen: this.getRecalculatedScreen(),
      lock: false, // Avoid re-render movies list
      finishLoad: false,
      logout: false,
      sort: {
        sort_by: 'meta.year',
        order: 'asc'
      }
    }

    // Max movies for initial request
    this.renderTimeout = null
    this.resizeTimeout = null
  }

  _index(i) {
    // Else try get from key file and save
    const _storage = {}
    return (i in _storage && _storage[i]) || 0
  }

  get loaded() {
    return +this._index('chunk') > 0
  }

  get cached() {
    return this._index('cached')
  }

  startRunning = (cb = null) => {
    this.setState({
      ready: true,
      loading: false
    }, cb)
  }

  getCurrentDb = () => {
    return DB.connect(
      this.state.selectedCollection
    )
  }

  storeCollections = async (movie) => {
    const db = this.getCurrentDb()
    // store movies in local database..
    await db.insert(movie).then((item) => {
      log.warn('Stored movies')
    })
  }


  // Handle ipc interactions and movies collections reception from network..
  startConnecting = async (cid) => {
    if (!cid) return;

    broker.removeAllListeners();
    broker.stopListeningIPC();
    broker.startListeningIPC();

    // the ipc notification when a new movie is added..
    broker.on('notification', async (e, n) => {
      const movie = { ...n, _id: n.meta.id };
      this.setState({ percent: parseInt(movie.progress), count: movie.count });

      // accumulate incoming movies and store them when finish..
      // this approach could help to handle errors if the app is closed before
      // receive the complete collection and force to restart...
      await this.storeCollections(movie)
      // when movie finish loading..
      if (movie.end) {
        this.startRunning()
      }
    });

    // connect to cid
    broker.connect(cid);
  }

  getRecalculatedScreen = () => {
    const w = Math.min(window.innerWidth, window.screen.width)
    const h = Math.min(window.innerHeight, window.screen.height)
    const width = util.isMobile() ? window.innerWidth : w
    const height = util.isMobile() ? window.innerHeight : h
    const defaults = util.calcScreenSize({
      width,
      height
    })

    log.info(`Recalculating Screen W:${width}, H:${height}`)
    return defaults
  }

  removeExtraRow = (movies, chunk) => {
    return movies.filter((i) => Object.is(i.length, chunk))
  }

  recalculateScreen = () => {
    if (!this.state.movies.length) return
    const defaults = this.getRecalculatedScreen()
    const chunkSize = defaults.chunkSize
    const moviesArrays = this.state.movies
    const movies = moviesArrays.flat(1)
    const moviesNewStructure = this.moviesToRow(movies, chunkSize)
    const cleanedMovies = this.removeExtraRow(moviesNewStructure, chunkSize)

    this.setState({
      loading: false,
      lock: false,
      movies: cleanedMovies,
      screen: defaults
    })
  }

  handleResize = () => {
    if (!this.state.loading) this.setState({ loading: true })
    this.resizeTimeout && clearTimeout(this.resizeTimeout)
    this.resizeTimeout = setTimeout(this.recalculateScreen, 500)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
    broker.removeAllListeners()
  }

  componentDidMount() {
    // Set initial screen
    window.addEventListener('resize', this.handleResize)
    this.startConnecting(this.state.selectedCollection)
  }

  handleClickMovie = (id) => {
    this.props?.onClickMovie(id)
    this.setState({ lock: true })
  }

  filterMovies(filter = {}, clear = false, chunks = null, cb = null) {
    if (this.state.logout) { return false } // Nothing to fetch. Go out!!

    console.log(filter)
    // Clean all.. invalid
    if ('genres' in filter) {
      if (filter.genres === 'All') {
        delete filter.genres
      }
    }

    // Add limit to filters
    filter = { ...{ limit: this.state.screen.limit }, ...filter }
    if ('to' in filter && 'start' in filter) {
      filter.limit = filter.to - filter.start
      filter.skip = filter.start
      log.info('Skip:', filter.skip)
      log.info('Chunk:', filter.limit)
    }

    // Get movies
    this.getCurrentDb().filter(filter).then((movies) => {
      // Chunk and concat movies
      log.warn('Movies filtered')
      const _chunk = chunks || this.state.screen.chunkSize
      const _movies = this.moviesToRow(movies, _chunk)

      // Handle sizes
      const size = _movies.length
      const newMovies = [...this.state.movies, ..._movies]
      const current = newMovies.length

      this.setState({
        scrolling: false,
        loading: false,
        count: !size ? current : (current + 10),
        finishLoad: !clear ? !size : false,
        movies: clear ? _movies : newMovies,
        lock: false
      })

      // Send state in cb
      cb && cb(this.state)
    })
  }

  loadOrder = (start, to, size = this.state.screen.chunkSize) => {
    start = start * size
    to = to * size
    log.warn('Fetching movies from db')
    return new Promise((resolve) => {
      // Throttling
      this.renderTimeout && clearTimeout(this.renderTimeout)
      this.renderTimeout = setTimeout(() => {
        this.filterMovies({
          ...{
            start,
            to
          },
          ...this.sort
        },
          false, false, (state) => {
            log.info('Infinite movies loaded')
            resolve(state)
          }
        )
      }, 500)
    })
  }

  moviesToRow(_movies, l) {
    return new Array(Math.ceil(_movies.length / l)).fill(0)
      .map((_, n) => _movies.slice(n * l, n * l + l))
  }


  handleOnChange = (sort, by) => {
    // Reset limit
    log.warn(`Sorting by ${by.action}`)
    // storage.add(this.sort).to.mainNavFilters()
    this.setState({ loading: true }, () => {
      // Set cache filters
      setTimeout(() => this.filterMovies({ [sort]: by.action }, true), 0)
    })
  }

  handleSignOut = (event) => {
    event.preventDefault()
    this.setState({
      ready: false,
      logout: true,
      state: 'Please Wait'
    })
  }

  render() {
    return (
      <>

        {
          (!this.state.ready &&
            <div className='movie-player full-width full-height loading'>
              <StateLoader
                stateText={this.state.state}
                statePercent={this.state.percent}
                onClose={!this.state.logout && this.handleSignOut}
              />
            </div>
          ) ||
          <div className='relative full-height main-view'>
            {/* Top main nav */}
            <section className='row full-height'>
              <div className='clearfix full-height'>
                {/* Top main nav */}
                <nav className='col l12 m12 transparent z-depth-0'>
                  <CatalogNav
                    onChange={this.handleOnChange}
                  />
                </nav>

                {/* Movies section lists */}
                <section className='row movies-box clearfix'>
                  {
                    (!this.state.loading &&
                      <CatalogList
                        movies={this.state.movies} loadOrder={this.loadOrder}
                        count={this.state.count} loading={this.state.lock}
                        end={this.state.finishLoad} chunkSize={this.state.screen.chunkSize}
                        onClick={this.handleClickMovie} screen={this.state.screen}
                      />) || <BoxLoader size={100} />
                  }
                </section>
              </div>
            </section>
          </div>
        }
      </>
    )
  }
}
