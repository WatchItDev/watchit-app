import React from 'react';
import uid from 'shortid';
import InfiniteLoader from 'react-window-infinite-loader';
import { FixedSizeList } from 'react-window';
import CatalogRow from './row';

const CatalogList = ({ movies, count, end, chunkSize, screen, onClick, loadOrder, cid }) => {

  const renderRow = ({ index, style }) => {
    if (!movies[index]) {
      return (
          <CatalogRow
              key={uid.generate()}
              style={style}
              chunk={Array(chunkSize).fill(0)}
              chunkSize={chunkSize}
              end={end}
          />
      );
    }

    return (
        <CatalogRow
            key={index}
            style={style}
            chunk={movies[index]}
            chunkSize={chunkSize}
            onClick={onClick}
            empty={false}
            preload
            end={end}
            cid={cid}
        />
    );
  };

  const alreadyLoaded = (index) => {
    return !!movies[index];
  };

  const onScrollUpdate = (start, end) => {
    return end
        ? new Promise(() => console.log('Finish'))
        : loadOrder && loadOrder(start, end);
  };

  return (
      <div className='movie-list-posters'>
        <InfiniteLoader
            isItemLoaded={alreadyLoaded}
            loadMoreItems={onScrollUpdate}
            itemCount={count + 2}
        >
          {({ onItemsRendered, ref }) => (
              <FixedSizeList
                  className='row-list'
                  height={screen.height}
                  itemCount={count}
                  itemSize={screen.chunkHeight}
                  onItemsRendered={onItemsRendered}
                  width={screen.width}
                  ref={ref}
              >
                {renderRow}
              </FixedSizeList>
          )}
        </InfiniteLoader>
      </div>
  );
};

export default CatalogList;

