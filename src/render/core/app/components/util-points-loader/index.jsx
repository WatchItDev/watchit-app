import React from 'react'
import Dots from 'render/media/img/spinner/three-dots.svg'

export default class PointsLoader extends React.Component {
    render() {
        return (
            <img alt="" className="points-loader" src={Dots}
                />
        )
    }
}
