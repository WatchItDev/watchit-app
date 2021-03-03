import React from 'react'
import uid from "shortid";
import PropTypes from "prop-types";
import AppMoviesListPoster from 'components/app-movies-list-poster'
import gatewayHelper from 'core/resources/helpers/gatewayHelper'

export default class AppMoviesListRow extends React.Component {

    static get propTypes() {
        return {
            chunk: PropTypes.array.isRequired
        }
    }


    parseUriImage = (image) => {
        if (image) {
            // While load chunk of movies image = undefined
            // Check if valid param before
            return gatewayHelper.dummyParse(image)
        }
    }


    shouldComponentUpdate() {
        return false
    }

    render() {
        return <div className={'clearfix row-img'} style={this.props.style}>
            {
                this.props.chunk.map((i) => {
                    return <AppMoviesListPoster
                        key={i._id || uid.generate()} id={i._id}
                        title={i.title} rating={i.rating} year={i.year}
                        image={this.parseUriImage(i.resource.images.medium_image)}
                        placeHolder={this.props.placeHolder}
                        onClick={this.props.onClick}
                    />
                })
            }
            {
                (this.props.chunk.length < this.props.chunkSize) &&
                Array(this.props.chunkSize - this.props.chunk.length).fill(0).map(() => {
                    return <AppMoviesListPoster key={uid.generate()} empty={true}/>
                })
            }
        </div>
    }
}