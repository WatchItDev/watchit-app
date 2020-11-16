import React from 'react'

export default class BarLoader extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <img alt="" className="bar-loader" src="/src/media/img/spinner/bars.svg"
                {...this.props}/>
        )
    }
}
