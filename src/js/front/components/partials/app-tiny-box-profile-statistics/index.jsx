import React from 'react'

export default class AppMenuProfileStatistics extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="clearfix">
                <div className="col l4 m6 text-center">
                    <div>
                        <strong className="font-size-tiny bold white-text">
                            0
                        </strong>
                    </div>
                    <div>
                        <span className="font-light-gray font-size-tiny">
                            following
                        </span>
                    </div>
                </div>
                <div className="col l4 m6 text-center">
                    <div>
                        <strong className="font-size-tiny bold white-text">
                            0
                        </strong>
                    </div>
                    <div>
                        <span className="font-light-gray font-size-tiny">
                            followers
                        </span>
                    </div>
                </div>
                <div className="col l4 text-center hide-on-md hide-on-med-only">
                    <div>
                        <strong className="font-size-tiny bold white-text">
                            0
                        </strong>
                    </div>
                    <div>
                        <span className="font-light-gray font-size-tiny">
                            plays
                        </span>
                    </div>
                </div>
            </div>
        )
    }
}
