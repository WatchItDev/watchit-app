/* global localStorage */
import React from 'react'
import Stats from '@components/Stats/'
import MainLoader from '@components/MainLoader/'
import Search from '@components/Search'

import CatalogList from './list'
import CatalogNav from './nav'

import util from '@helpers/util'
import log from '@logger'

// Access to main process bridge prop
import { Broker as broker, DB as db } from '@main/bridge'

// Login pages class
export default class Catalog extends React.Component {
  constructor(props) {
    super(props)
    // Initial state
    this.state = {
      state: 'Bootstrapping',
      percent: 0,
      count:10,
      total: 0,
      ready: false,
      loading: true,
      movies: [],
      screen: {},
      lock: false, // Avoid re-render movies list
      finishLoad: false,
      sort: {
        sort_by: 'meta.year',
        order: 'asc'
      }
    }

    // Max movies for initial request
    this.renderTimeout = null
    this.resizeTimeout = null
    this.moviesWrapper = React.createRef()
  }

  get db() {
    return db.connect(
      this.props.cid
    )
  }


  startRunning = (count) => {
    this.setState({
      ready: true,
      total: count,
      count
    })
  }

  storeCollections = async (movie) => {
    // store movies in local database..
    await this.db.insert(movie).then(() => {
      log.warn('Stored movies')
    })
  }

  // Handle ipc interactions and movies collections reception from network..
  startConnecting = async (cid) => {
    if (!cid) return;

    // check if collection is already stored..
    const cachedCount = await this.db.count()
    if (cachedCount > 0)
      return this.startRunning(cachedCount)

    broker.removeAllListeners();
    broker.stopListeningIPC();
    broker.startListeningIPC();

    const acc = [];
    // the ipc notification when a new movie is added..
    broker.on('notification', async (e, n) => {
      const movie = { ...n, _id: n.meta.id };
      this.setState({ percent: parseInt(movie.progress), count: movie.count, total: movie.count });

      // accumulate incoming movies and store them when finish..
      // this approach could help to handle errors if the app is closed before
      // receive the complete collection and force to restart...
      // when movie finish loading..
      acc.push(movie);
      if (movie.end) {
        await this.storeCollections(acc)
        this.startRunning(movie.count)
      }
    });

    // connect to cid
    broker.connect(cid);
  }

  getRecalculatedScreen = () => {
    const width = this.moviesWrapper.current?.offsetWidth;
    const height = this.moviesWrapper.current?.offsetHeight;
    const defaults = util.calcScreenSize({
      width,
      height
    })

    log.info(`Recalculating Screen W:${width}, H:${height}`)
    return defaults
  }

  moviesToRow(_movies, l) {
    return new Array(Math.ceil(_movies.length / l)).fill(0)
      .map((_, n) => _movies.slice(n * l, n * l + l))
  }

  removeExtraRow = (movies, chunk) => {
    return movies.filter((i) => Object.is(i.length, chunk))
  }

  recalculateScreen = () => {
    if (!this.state.movies.length) return
    const defaults = this.getRecalculatedScreen()
    const movies = this.state.movies.flat(1)
    const moviesNewStructure = this.moviesToRow(movies, defaults.chunkSize)
    const cleanedMovies = this.removeExtraRow(moviesNewStructure, defaults.chunkSize)

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

  // shouldComponentUpdate(nextProps, nextState) {
  //   return nextProps.cid !== this.props.cid || nextState.loading;
  // }


  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
    broker.removeAllListeners()
  }

  componentDidMount() {
    // Set initial screen
    window.addEventListener('resize', this.handleResize)
    const defaults = this.getRecalculatedScreen()
    this.setState({ screen: defaults })
    this.startConnecting(this.props.cid)
  }

  handleClickMovie = (id) => {
    this.props?.onClickMovie(id)
    this.setState({ lock: true })
  }

  filterMovies(filter = {}, clear = false, chunks = null, cb = null) {
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
    this.db.filter(filter).then((movies) => {
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
        count: current,
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
          ...{ start, to },
          ...this.state.sort
        }, false, false, (state) => {
          log.info('Infinite movies loaded')
          resolve(state)
        })
      }, 500)
    })
  }

  handleOnChange = (sort, by) => {
    // Reset limit
    log.warn(`Sorting by ${by.action}`)
    // storage.add(this.sort).to.mainNavFilters()
    this.setState({
      loading: true,
      // persist old sorting conf..
      sort: { ...this.state.sort, [sort]: by.action }
    }, () => {
      // Set cache filters
      setTimeout(() => this.filterMovies(this.state.sort, true), 0)
    })
  }

  handleSignOut = (event) => {
    event.preventDefault()
    this.props.onSignOut(this.props.cid)
  }

  render() {
    return (
      <div className='relative full-height main-view' ref={this.moviesWrapper}>
        {this.state.loading &&
          <MainLoader
            content={this.state.percent > 0 ? `${this.state.percent} %` : null}
            percent={this.state.percent}
          />
        }
        {
          <section className='row full-height'>
            <div className='clearfix full-height'>
              <header className='no-margin vertical-padding transparent z-depth-1 d-flex align-items-center justify-content-between header_search'>
                <Search cid={this.props.cid} onClick={this.handleClickMovie} />
                <nav className='col l6 m6 transparent z-depth-0'>
                  <CatalogNav
                    onChange={this.handleOnChange}
                  />
                </nav>
                {<Stats onSignOut={this.handleSignOut} />}
              </header>
              {/* Top main nav */}

              {/* Movies section lists */}
              <section className='row movies-box clearfix'>
                {
                  (this.state.ready &&
                    <CatalogList
                      movies={this.state.movies} loadOrder={this.loadOrder}
                      count={this.state.count} loading={this.state.lock}
                      end={this.state.finishLoad} chunkSize={this.state.screen.chunkSize}
                      onClick={this.handleClickMovie} onPlay={this.props.onPlayMovie} screen={this.state.screen}
                    />)
                }
              </section>
            </div>
          </section>
        }
      </div>
    )
  }
}
