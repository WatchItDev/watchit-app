import React from 'react'
import icon from 'render/media/icons/icon.png'

export default class Logo extends React.Component {
    render() {
        return (
            <h5 className="no-margin font-type-titles logo">
                <img src={icon} alt="" width={50} height={50}/>
                <span className="white-text relative" style={{top: "-9px", fontWeight: 600}}>ATCH</span>
                <strong className="bold loader-text relative" style={{top: "-9px"}}>IT</strong>
            </h5>
        )
    }
}
