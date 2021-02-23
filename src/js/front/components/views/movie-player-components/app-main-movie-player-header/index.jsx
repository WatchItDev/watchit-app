import React from 'react'

export default class AppMoviesPlayerHeader extends React.PureComponent {

    render() {
        return (
            <header className="row absolute z-index-100 top-2-vh left-2-vw clearfix">
                <div className="row">
                    <h4 className="white-text bold font-type-titles">
                        {this.props.title}
                    </h4>
                </div>
                <div>{this.props.children}</div>
            </header>
        )
    }
}
