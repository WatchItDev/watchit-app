/* global localStorage */
import React from 'react'
import Details from '@components/Details/'
import StateLoader from '@components/PlayerLoader/'
import Stats from '@components/Stats/'
import BoxLoader from '@components/BoxLoader/'
import Search from '@components/Search'

import CatalogList from './list'
import CatalogNav from './nav'

import Movie from '@db/movies'
import storage from '@helpers/storage'
import util from '@helpers/util'
import log from '@logger'

// Access to main process bridge prop
import { Key as key, Broker as broker } from '@main/bridge'

const DEFAULT_INIT_LOAD = 100

// Login pages class
export default class Catalog extends React.Component {
  constructor (props) {
    super(props)
    // It cached or loaded initial chunk
    const itCached = this.cached || this.loaded
    log.warn(`Init with cached:${!!this.cached} and loaded:${!!this.loaded}`)

    // Initial state
    this.state = {
      state: 'Bootstrapping',
      percent: 0,
      peers: this.peers,
      count: DEFAULT_INIT_LOAD,
      ready: itCached,
      loading: !itCached,
      movies: [],
      screen: this.getRecalculatedScreen(),
      lock: false, // Avoid re-render movies list
      finishLoad: false,
      showDetailsFor: false,
      logout: false
    }

    // Max movies for initial request
    this.movie = new Movie(broker)
    this.renderTimeout = null
    this.resizeTimeout = null
    this.sort = {
      sort_by: 'year',
      order: 'desc'
    }
  }

  _index (i) {
    // Else try get from key file and save
    const _storage = key.readFromStorage() || {}
    return (i in _storage && _storage[i]) || 0
  }

  get loaded () {
    return +this._index('chunk') > 0
  }

  get cached () {
    return this._index('cached')
  }

  startRunning = (cb = null) => {
    if (this.state.logout) return
    this.setState({
      ready: true,
      loading: false
    }, cb)
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

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize)
    broker.removeAllListeners()
  }

  componentDidMount () {
    // Set initial screen
    window.addEventListener('resize', this.handleResize)

    // Start ingest if not
    if (this.cached) {
      log.info('Running Cache')
      broker.removeAllListeners()
      broker.stopIpcEvents()
      broker.listenForNewPeer()
      broker.listenForPartyRock()
      broker.startSeed()
      broker.on('chaos', this.chaos)
      return
    }

    // Start ingestion
    this.runIngest()
  }

  handleClickMovie = (id) => {
    this.setState({
      showDetailsFor: id,
      lock: true
    })
  }

  handleClickCloseMovie = (e) => {
    e.preventDefault()
    this.setState({
      showDetailsFor: false
    })
  }

  chaos = () => {
    // Wait for redirect to app login
    log.warn('Redirecting...')
    setTimeout(() => { window.location.href = '#/' }, 0)
  }

  runIngest () {
    // Init ingest
    broker.removeAllListeners().on('progress', (state) => {
      this.setState({ state: state })
    }).on('start', async () => {
      log.info('STARTING')
      // if (!this.loaded) localStorage.clear();
    }).on('ready', () => {
      // Start filtering set cache synced movies
      log.info('LOADED FROM LOCAL')
      this.startRunning()
    }).on('error', (msg = 'Waiting Network') => {
      if (this.state.ready) return
      this.setState({
        state: msg,
        ready: false
      })
    }).on('done', () => {
      log.info('LOAD DONE')
    }).on('chaos', this.chaos).load()
  }

  filterMovies (filter = {}, clear = false, chunks = null, cb = null) {
    if (this.state.logout) { return false } // Nothing to fetch. Go out!!

    // Get from cache filters
    if (storage.get().from.mainNavFilters()) { filter = { ...filter, ...storage.get().from.mainNavFilters() } }

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
    this.movie.filter(filter).then((movies) => {
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

  moviesToRow (_movies, l) {
    return new Array(Math.ceil(_movies.length / l)).fill(0)
      .map((_, n) => _movies.slice(n * l, n * l + l))
  }

  initialNavVar (genres, sort) {
    // Has sort cache?
    // Get cache from localStorage
    const navCache = storage.get().from.mainNavFilters()
    if (!navCache) {
      return {
        genres: genres,
        sort: sort
      }
    }
    const currentNav = {
      genres: genres,
      sort_by: sort
    }

    // For each key in cache
    Object.keys(currentNav)
      .forEach((k) => {
        // Clean old default prop
        currentNav[k].forEach((el) => delete el.default)
        currentNav[k].map((el) => {
          if (Object.is(el.action, navCache[k])) { el.default = true }
          return el
        })
      })

    // Return initial
    return {
      genres: genres,
      sort: sort
    }
  }

  handleOnChange = (sort, by) => {
    // If by?
    if ((storage.get().from.mainNavFilters())) {
      this.sort = Object.assign(
        {}, this.sort,
        storage.get().from.mainNavFilters(),
        { [sort]: by.action }
      )
    } else {
      if (by.action) {
        this.sort = Object.assign(
          {}, this.sort, { [sort]: by.action }
        )
      } else {
        if (sort in this.sort) {
          delete this.sort[sort]
        }
      }
    }

    // Reset limit
    log.warn(`Sorting by ${by.action}`)
    storage.add(this.sort).to.mainNavFilters()
    this.setState({ loading: true }, () => {
      // Set cache filters
      setTimeout(() => this.filterMovies(this.sort, true), 0)
    })
  }

  handleSignOut = (event) => {
    event.preventDefault()
    localStorage.clear()
    broker.flush()
    this.setState({
      ready: false,
      logout: true,
      state: 'Please Wait'
    })
  }

  render () {
    return (
      <>
        {
          this.state.showDetailsFor &&
            <Details
              id={this.state.showDetailsFor}
              onClick={this.handleClickCloseMovie}
            />
        }

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
                  <header className='no-margin vertical-padding transparent z-depth-1 d-flex align-items-center justify-content-between header_search'>
                    <Search movies={this.movie} onClick={this.handleClickMovie} />
                    <Stats handler={this._index} onSignOut={this.handleSignOut} />
                  </header>

                  {/* Top main nav */}
                  <nav className='col l12 m12 transparent z-depth-0'>
                    <CatalogNav
                      onChange={this.handleOnChange}
                      setInitialNavVar={this.initialNavVar}
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
