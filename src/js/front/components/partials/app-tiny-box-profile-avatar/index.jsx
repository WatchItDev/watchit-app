import React from 'react'

//Class Profile
export default class AppTinyProfileAvatar extends React.Component {

    static get defaultProps() {
        return {
            href: '#',
            size: 'l3 m3'
        }
    }


    render() {
        return (
            <div className={`${this.props.size && 'col ' + this.props.size} small-picture`}>
                <a href={this.props.href} className="clearfix profile-picture-img">
                    <figure>
                        <img src={this.props.photo || 'http://lorempixel.com/60/60/abstract/'} alt=""/>
                    </figure>
                </a>
            </div>
        )
    }
}
