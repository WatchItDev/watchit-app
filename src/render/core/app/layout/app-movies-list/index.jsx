import React from 'react'
import uid from "shortid";
import AppMoviesListRow from 'components/app-movies-list-row/'
import InfiniteLoader from "react-window-infinite-loader";
import {FixedSizeList as List} from "react-window";

export default class AppMoviesList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            movies: [], end: false,
            chunkSize: 0, count: 0,
            screen: {}, min: 0
        }
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return !nextProps.loading && nextProps.movies.length > 0
    }

    static getDerivedStateFromProps(nextProps) {
        if (!nextProps.movies)
            return null;

        const movies = nextProps.movies; // [[5],[5],->X[3]] = [[5], [5]]
        const count = nextProps.count;
        const end = nextProps.end;
        const chunkSize = nextProps.chunkSize;
        const screen = nextProps.screen;
        const min = Math.min(...movies.map(e => e.length))
        return {count, movies, end, chunkSize, screen, min};
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
        const currentRow = this.state.movies[index]
        return !!currentRow // && currentRow.length > this.state.min
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
                threshold={8}
                itemCount={this.state.count}
            >
                {({onItemsRendered, ref}) => (
                    <List className="row-list"
                          height={this.state.screen.height}
                          itemCount={this.state.count}
                          itemSize={this.state.screen.chunkHeight}
                          onItemsRendered={onItemsRendered}
                          width={this.state.screen.width}
                          ref={ref}
                    >
                        {this.renderRow}
                    </List>
                )}
            </InfiniteLoader>
        </div>
    }
}
