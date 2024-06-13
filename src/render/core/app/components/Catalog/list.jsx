import React from 'react'
import uid from 'shortid'
import InfiniteLoader from 'react-window-infinite-loader'
import { FixedSizeList } from 'react-window'
import CatalogRow from './row'

export default class CatalogList extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      movies: [],
      end: false,
      chunkSize: 0,
      count: 0,
      screen: {}
    }
  }

  static getDerivedStateFromProps (nextProps) {
    if (!nextProps.movies) { return null }

    const movies = nextProps.movies
    const count = nextProps.count
    const end = nextProps.end
    const chunkSize = nextProps.chunkSize
    const screen = nextProps.screen
    return { count, movies, end, chunkSize, screen }
  }

  renderRow = ({ index, style }) => {
    if (!this.state.movies[index]) {
      return (
        <CatalogRow
          key={uid.generate()} style={style}
          chunk={Array(this.state.chunkSize).fill(0)}
          chunkSize={this.state.chunkSize} empty
          onClick={() => {}} onPlay={() => {}}
        />
      )
    }

    return (
      <CatalogRow
        key={index} style={style}
        chunk={this.state.movies[index]}
        chunkSize={this.state.chunkSize}
        onClick={this.props.onClick}
        onPlay={this.props.onPlay}
        screen={this.props.screen}
        empty={false} preload
      />
    )
  }

  alreadyLoaded = (index) => {
    return !!this.state.movies[index]
  }

  onScrollUpdate = (...params) => {
    const [start, end] = params
    return this.state.end
      ? new Promise(() => console.log('Finish'))
      : this.props.loadOrder?.(start, end)
  }

  render () {
    return (
      <div className='movie-list-posters'>
        <InfiniteLoader
          isItemLoaded={this.alreadyLoaded}
          loadMoreItems={this.onScrollUpdate}
          itemCount={this.state.count}
        >
          {({ onItemsRendered, ref }) => (
            <FixedSizeList
              className='row-list'
              height={this.state.screen.height}
              itemCount={this.state.count}
              itemSize={this.state.screen.chunkHeight}
              onItemsRendered={onItemsRendered}
              width={this.state.screen.width}
              ref={ref}
            >
              {this.renderRow}
            </FixedSizeList>
          )}
        </InfiniteLoader>
      </div>
    )
  }
}
