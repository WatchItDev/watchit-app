import React from 'react'
import AppNav from 'js/front/components/views/movie-index-components/app-main-movies-nav-bar/'
import AppMovies from 'js/front/components/views/movie-index-components/app-main-movies-list/'
import AppSearch from 'js/front/components/views/movie-index-components/app-main-movies-search/'
import AppLoader from 'js/front/components/views/movie-player-components/app-main-movie-player-loader'
import AppMovieDetails from 'js/front/components/views/movie-details-components/app-movie-details'
import AppUpdater from 'js/front/components/views/movie-index-components/app-main-movies-updater'
import StatsValue from "js/front/components/generic/util-stats";
import storageHelper from 'js/resources/helpers/storageHelper';
import logHelper from 'js/resources/helpers/logHelper'
import BoxLoader from 'js/front/components/generic/util-box-loader/index.jsx'
import Movie from 'js/resources/data/movies'
import setting from 'js/settings'

const DEFAULT_INIT_LOAD = 100;
//Login view class
export default class MovieIndex extends React.Component {
    constructor(props) {
        super(props);

        //Default state
        this.state = {
            state: 'Connecting', percent: 0, peers: this.peers, count: DEFAULT_INIT_LOAD,
            ready: false, loading: true, movies: [], chunkSize: setting.defaults.chunkSize,
            scrolling: false, finishLoad: false, showDetailsFor: false
        };

        this.ingest = window.Ingest;
        this.movie = new Movie(this.ingest.p);

        //Max movies for initial request
        this.limit = setting.defaults.limit;
        this.sort = {
            sort_by: 'year',
            order: 'desc'
        };

    }

    _index(i) {
        // Else try get from key file and save
        let _storage = window.Auth.readFromStorage() || {}
        return (i in _storage && _storage[i]) || 0
    }

    get loaded() {
        return +this._index('chunk') > 0;
    }

    get cached() {
        return this._index('cached')
    }

    startRunning(cb = null) {
        this.setState({
            ready: true,
            loading: false
        }, cb)
    }

    componentWillUnmount() {
        this.ingest.stopEvents();
    }

    componentDidMount() {
        // Start ingest if not
        if (this.cached) {
            console.log('Running Cache');
            this.ingest.stopEvents();
            this.ingest.stopIpcEvents();
            this.ingest.listenForNewPeer();
            this.ingest.on('bc', (m) => {
                this.setState({percent: 0, state: m, ready: false});
                setTimeout(() => window.location.href = '#/', 3000)
            }).startSeed()
            // Start running node
            return this.startRunning();
        }

        if (this.loaded) {
            return this.startRunning(() => {
                this.runIngest();
            });
        }

        // Start ingestion
        this.runIngest();
    }

    onClickMovie = (id) => {
        this.setState({
            showDetailsFor: id,
            scrolling: true
        })
    }

    onClickCloseMovie = (e) => {
        e.preventDefault();
        this.setState({
            showDetailsFor: false
        })
    }

    runIngest() {
        // Init ingest
        this.ingest.stopEvents().on('progress', (state) => {
            this.setState({state: state, percent: 0})
        }).on('start', async () => {
            console.clear();
            logHelper.info('STARTING');
            if (!this.loaded) {
                localStorage.clear();
                // await this.movie.setupIndex();
            }
        }).on('ready', () => {
            //Start filtering set cache synced movies
            logHelper.info('LOADED FROM LOCAL');
            this.startRunning()
        }).on('ba', (p) => {
            this.setState({percent: p})
        }).on('bc', (m) => {
            this.setState({percent: 0, state: m});
            setTimeout(() => window.location.href = '#/', 2000)
        }).on('error', (msg = 'Waiting Network') => {
            if (this.state.ready) return;
            this.setState({percent: 0, state: msg});
        }).on('done', () => {
            logHelper.info('LOAD DONE')
        }).load()

    }

    filterMovies(filter = {}, clear = false, chunks = null, cb = null) {

        //Get from cache filters
        if (storageHelper.get().from.mainNavFilters())
            filter = {...filter, ...storageHelper.get().from.mainNavFilters()}


        //Clean all.. invalid
        if ('genres' in filter) {
            if (filter['genres'] === 'All') {
                delete filter['genres']
            }
        }

        // Add limit to filters
        filter = {...{limit: this.limit}, ...filter};
        if ('to' in filter && 'start' in filter) {
            filter.limit = filter.to - filter.start;
            filter.skip = filter.start;
            console.log('Skip:', filter.skip);
            console.log('Chunk:', filter.limit);
        }

        //Get movies
        this.movie.filter(filter).then((movies) => {
            //Chunk and concat movies
            let _chunk = chunks || this.state.chunkSize;
            let _movies = this.moviesToRow(movies, _chunk);

            // Handle sizes
            let _size = _movies.length;
            let _new_movies = [...this.state.movies, ..._movies];
            let _current = _new_movies.length;

            this.setState({
                scrolling: false, loading: false, chunkSize: _chunk,
                count: !_size ? _current : (_current + 10),
                finishLoad: !clear ? !_size : false,
                movies: clear ? _movies : _new_movies,
            });

            // Send state in cb
            cb && cb(this.state)
        })
    }

    loadOrder = (start, to, size = this.state.chunkSize) => {
        start = start * size;
        to = to * size;
        this.setState({scrolling: true});
        return new Promise((resolve) => {
            //Throttling
            setTimeout(() => {
                this.filterMovies({...{start, to}, ...this.sort},
                    false, false, (state) => {
                        console.log('Movies loaded');
                        resolve(state)
                    }
                )
            }, 500)
        })
    }

    moviesToRow(_movies, l) {
        return new Array(Math.ceil(_movies.length / l)).fill(0)
            .map((_, n) => _movies.slice(n * l, n * l + l));
    }

    initialNavVar(genres, sort) {
        //Has sort cache?
        if (storageHelper.get().from.mainNavFilters()) {
            //Get cache from localStorage
            let _sort_cache = storageHelper.get().from.mainNavFilters();
            let _hash = {'genres': genres, 'sort_by': sort};

            //For each key in cache
            for (let key_ in _hash) {
                //Check for genres in cache filter
                if (key_ in _sort_cache) {
                    //Iterate over element lists
                    for (let item in _hash[key_]) {
                        //Clean default
                        if ('default' in _hash[key_][item])
                            delete _hash[key_][item]['default'];

                        //Set new default
                        if (Object.is(_hash[key_][item].action, _sort_cache[key_])) {
                            _hash[key_][item]['default'] = true;
                        }
                    }
                }
            }
        }

        //Return initial
        return {
            genres: genres,
            sort: sort
        }
    }

    onChange = (sort, by) => {
        //If by?
        if ((storageHelper.get().from.mainNavFilters())) {
            this.sort = Object.assign(
                {}, this.sort,
                storageHelper.get().from.mainNavFilters(),
                {[sort]: by}
            );
        } else {
            if (by) {
                this.sort = Object.assign(
                    {}, this.sort, {[sort]: by}
                );
            } else {
                if (sort in this.sort) {
                    delete this.sort[sort]
                }
            }
        }

        //Set new state
        //Reset limit
        logHelper.warn('RESET OFFSET AND ENABLED INFINITE SCROLL');
        this.setState({loading: true});

        //Set cache filters
        storageHelper.add(this.sort).to.mainNavFilters();
        this.filterMovies(this.sort, true);
    }

    signOut = (event) => {
        event.preventDefault();
        localStorage.clear();
        this.ingest.flush();
        window.location.href = '#/'
    }


    render() {
        return (
            <>
                {
                    this.state.showDetailsFor &&
                    <AppMovieDetails
                        id={this.state.showDetailsFor}
                        onClick={this.onClickCloseMovie}
                    />
                }

                {
                    /* Happy hunt */
                    <AppUpdater/>
                }

                {
                    (!this.state.ready &&
                        <div className={`movie-player full-width full-height loading`}>
                            <AppLoader stateText={this.state.state} statePercent={this.state.percent}/>
                        </div>
                    ) ||
                    <div className="relative full-height main-view">
                        {/*Top main nav*/}
                        <section className="row full-height">
                            <div className="clearfix full-height">
                                <header
                                    className="no-margin vertical-padding transparent z-depth-1 d-flex align-items-center justify-content-between header_search">
                                    <div className="col l6 m6 relative input-black-box">
                                        <AppSearch onClick={this.onClickMovie}/>
                                    </div>

                                    <div className="top-right-small-menu">
                                        <strong className={'white-text right'}>
                                            <StatsValue handler={this._index}/>
                                            <a onClick={this.signOut} className="logout" href={'/'}>
                                                <i className="icon-log-out font-size-1-rem white-text"/>
                                            </a>
                                        </strong>
                                    </div>
                                </header>

                                {/*Top main nav*/}
                                <nav className="col l12 m12 transparent z-depth-0">
                                    <AppNav
                                        onChange={this.onChange}
                                        setInitialNavVar={this.initialNavVar}
                                    />
                                </nav>

                                {/* Movies section lists */}
                                <section className="row movies-box clearfix">
                                    {
                                        (!this.state.loading &&
                                            <AppMovies
                                                movies={this.state.movies} loadOrder={this.loadOrder}
                                                count={this.state.count} loading={this.state.scrolling}
                                                end={this.state.finishLoad} chunkSize={this.state.chunkSize}
                                                onClick={this.onClickMovie}
                                            />) || <BoxLoader size={100}/>
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
