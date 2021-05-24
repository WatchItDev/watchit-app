import React from 'react'
import Image from 'components/app-image/'
import PulseLoader from 'components/util-pulse-loader/'

export default class AppMoviesListPoster extends React.Component {

    shouldComponentUpdate() {
        return false
    }

    static get defaultProps() {
        return {
            empty: true
        }
    }

    onClick = (e) => {
        e.preventDefault();
        this.props.onClick &&
        this.props.onClick(this.props.id)
    }

    render() {
        return (
            <div className={`col relative movies-poster padding-left-2 padding-right-2 item`}>
                {
                    // Show loader if empty result before load
                    this.props.empty && <PulseLoader/>
                }
                {
                    !this.props.empty &&
                    <a href={`/#`} onClick={this.onClick}>
                        {/* Image Box */}
                        <Image src={this.props.image} preload={this.props.preload}/>
                        {/* Label Box */}
                        <div className="hover-poster-box full-width full-height">
                            <div className="hover-info absolute bottom-1-rem">
                                <strong className="white-text truncate">
                                    {this.props.title}
                                </strong>
                                <span className="green-text">
                                <i className="icon-calendar margin-right-3-p"/>
                                    {this.props.year}
                            </span>
                                <span className="orange-text margin-left-5-p">
                                <i className="icon-star margin-right-2-p"/>
                                    {this.props.rating}
                            </span>
                            </div>
                        </div>
                    </a>
                }
            </div>
        )
    }
}
