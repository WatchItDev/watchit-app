import React from 'react';

export default class ProgressBar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="absolute full-height full-width loading-box has-main-background valign-wrapper">
                <div className="center-block valign">
                    <div className="z-index-middle">
                        <img className="width-80-p" alt="" src="/src/media/img/spinner/audio.svg"
                             {...this.props} />
                    </div>
                </div>
            </div>
        )
    }
}
