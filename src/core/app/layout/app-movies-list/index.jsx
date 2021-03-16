import React from 'react'
import uid from "shortid";
import AppMoviesListRow from 'components/app-movies-list-row/'
import InfiniteLoader from "react-window-infinite-loader";
import {FixedSizeList as List} from "react-window";

export default class AppMoviesList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            movies: [], loading: false,
            end: false, chunkSize: 0, count: 0,
            settings: {}
        }
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return !nextProps.loading && nextProps.movies.length > 0
    }

    static getDerivedStateFromProps(nextProps) {
        if (!nextProps.movies)
            return null;

        let movies = nextProps.movies;
        let count = nextProps.count;
        let loading = nextProps.loading;
        let end = nextProps.end;
        let chunkSize = nextProps.chunkSize;
        let settings = nextProps.settings;
        return {count, movies, loading, end, chunkSize,settings};
    }

    renderRow = ({index, style}) => {
        if (!this.state.movies[index])
            return <AppMoviesListRow
                key={uid.generate()} style={style}
                chunk={Array(this.state.chunkSize).fill(0)}
                chunkSize={this.state.chunkSize}
                placeHolder={true}
            />;

        return <AppMoviesListRow
            key={index} style={style}
            chunk={this.state.movies[index]}
            chunkSize={this.state.chunkSize}
            onClick={this.props.onClick}
        />

    }


    alreadyLoaded = (index) => {
        return !!this.state.movies[index]
    }

    onScrollUpdate = (...params) => {
        let [start, end] = params;
        return this.state.end ? new Promise(
            () => console.log('Finish')
        ) : this.props.loadOrder && this.props.loadOrder(start, end)
    }

    render() {
        return <div className="movie-list-posters">
            <InfiniteLoader
                isItemLoaded={this.alreadyLoaded}
                loadMoreItems={this.onScrollUpdate}
                itemCount={this.state.count}
            >
                {({onItemsRendered, ref}) => (
                    <List className="row-list"
                          height={this.state.settings.height}
                          itemCount={this.state.count}
                          itemSize={this.state.settings.chunkHeight}
                          onItemsRendered={onItemsRendered}
                          width={this.state.settings.width}
                          ref={ref}
                    >
                        {this.renderRow}
                    </List>
                )}
            </InfiniteLoader>
        </div>
    }
}
