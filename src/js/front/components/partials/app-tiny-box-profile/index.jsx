import React from 'react'
import BarLoader from 'js/front/components/generic/util-bar-loader/index.jsx'
import AppTinyProfileAvatar from 'js/front/components/partials/app-tiny-box-profile-avatar/index.jsx'

//Class Profile
export default class AppTinyProfile extends React.Component {
    constructor(props) {
        super(props);
        //Initial state
        this.state = {
            logout: false
        }
    }
    
    render() {
        return (
            (
                !this.state.logout && this.props.user && <div className="clearfix">
                    {/*Small avatar*/}
                    <AppTinyProfileAvatar photo={this.props.user.photoURL}/>
                    {/*Content info*/}
                    <div className="col l9 m9 small-user-data">
                        <div className="col l12 m12 truncate white-text">
                            <strong className="bold no-margin">{this.props.user.displayName}</strong>
                        </div>
                    </div>


                </div>
                || <BarLoader />
            )
        )
    }
}
