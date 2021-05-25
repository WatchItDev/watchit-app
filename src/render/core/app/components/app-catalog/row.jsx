import React from 'react'
import uid from "shortid";
import PropTypes from "prop-types";
import CatalogPoster from './poster'

export default class CatalogRow extends React.Component {

    static get propTypes() {
        return {
            chunk: PropTypes.array.isRequired
        }
    }


    shouldComponentUpdate() {
        return false
    }

    render() {
        return <div className={'clearfix row-img'} style={this.props.style}>
            {
                this.props.chunk.map((i) => {
                    return <CatalogPoster
                        key={i._id || uid.generate()} id={i._id}
                        title={i.title} rating={i.rating} year={i.year}
                        image={i?.resource?.images?.medium}
                        {...this.props}
                    />
                })
            }
            {
                (this.props.chunk.length < this.props.chunkSize) &&
                Array(this.props.chunkSize - this.props.chunk.length).fill(0).map(() => {
                    return <CatalogPoster key={uid.generate()} empty={true}/>
                })
            }
        </div>
    }
}