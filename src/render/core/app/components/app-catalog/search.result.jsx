import React from 'react'
import PointsLoader from '@components/util-points-loader'
import CustomScrollbars from '@components/util-scroller'
import CatalogSearchResultItem from './search.result.item'

export default class CatalogSearchResult extends React.Component {
  shouldComponentUpdate (nextProps, nextState, nextContext) {
    return !Object.is(nextProps.searching, this.props.searching) ||
      !Object.is(nextProps.result.length, this.props.result.length)
  }

  render () {
    return (
      <section className='absolute full-width search-result-box left-0 top-100-p z-index-100'>
        {
          (this.props.searching &&
            <div className='result-search-box text-center padding-10'>
              <PointsLoader />
            </div>
          ) ||
            <CustomScrollbars
              autoHide
              autoHeight
              autoHeightMax={500}
              autoHideTimeout={1000}
              autoHideDuration={200}
              thumbMinSize={30}
              universal
            >
              {
              (this.props.result.length > 0 &&
                <div className='result-search-box'>
                  <ul className='collection no-border'>
                    {(
                      this.props.result.map((i) => {
                        return (
                          <CatalogSearchResultItem
                            key={i._id} {...Object.assign(i, { image: i.resource.posters.small })}
                            onClick={this.props.onClick}
                          />
                        )
                      })
                    )}
                  </ul>
                </div>) ||
                  <div className='result-search-box text-center padding-10'>
                    <span className='white-text bold'>No results were found</span>
                  </div>
            }
            </CustomScrollbars>
        }
      </section>
    )
  }
}
