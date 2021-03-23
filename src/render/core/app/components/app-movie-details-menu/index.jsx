import React from 'react'
import settings from 'settings'
import PropTypes from 'prop-types'
import NavBarMenu from 'components/app-nav-bar-menu/'
import NavBarButton from 'components/app-nav-bar-button/'
import cryptHelper from 'render/core/resources/helpers/crypt'
import TrailerPop from 'components/app-movie-details-trailer'
import gatewayHelper from "resource/helpers/gateway";
import util from 'resource/helpers/util'

export default class AppMovieDetailMenu extends React.PureComponent {
    constructor(props) {
        super(props);
        //Default state
        this.state = {
            resource: null,
            modalOpen: false
        };
    }

    static get propTypes() {
        return {
            movie: PropTypes.object.isRequired
        }
    }


    isMovieResource(resourceType) {
        return settings.streaming.includes(
            resourceType
        )
    }


    parseResource = (resource) => {
        if (resource) {
            return gatewayHelper._builtPath(
                resource
            )
        }
    }

    getHealth(rate) {
        rate = rate < 1 ? 'red-text' :
            rate >= 1 && rate <= 2 ?
                'yellow-text' : 'green-text';
        return <i className={`icon-heart pointer-events-none ${rate}`}/>
    }

    prepareMenu(items) {
        let i = 0;
        //Prepare for menu structure
        return items.map((v) => {
            // If type of items is torrent
            let resourceType = v?.type
            let isMovieResource = this.isMovieResource(resourceType);
            if (isMovieResource) //If not found in available resolutions list... Skip !!
                if (!(~(settings.resolutions.available.indexOf(v.quality))))
                    return false;

            return {
                default: (i++ === 0), type: v.type,
                label: isMovieResource ? v.quality : (v[0].toUpperCase() + v.slice(1)),
                action: isMovieResource ? this.parseResource(v) : v,
                icon: isMovieResource ? this.getHealth(v.health) : null,
            };
        });
    }


    onMenuChange = (t) => this.prepareDataToPlayer(t.action, t.type)

    prepareDataToPlayer(resource, type) {
        //Handle type of menu
        this.setState({
            resource: cryptHelper.toBase64(
                JSON.stringify({
                    type, cid: resource,
                    id: this.props.movie._id,
                    title: this.props.movie.title
                })
            )
        })

    }

    closeTrailer = () => {
        this.setState({
            modalOpen: false
        })
    }

    openTrailer = (e) => {
        e.preventDefault();
        this.setState({
            modalOpen: true
        })
    }

    selectBestQuality(resources) {
        const groupedQualities = util.groupBy(resources, 'quality');
        return Object.keys(groupedQualities).map((key) => {
            return groupedQualities[key].reduce((old, curr) => {
                let bestOne = (old.health || 0) > curr.health;
                return bestOne ? old : curr;
            });
        });
    }

    render() {
        return (
            <nav className="col l12 m12 transparent z-depth-0">
                <div className="nav-wrapper">

                    {
                        this.state.modalOpen &&
                        <TrailerPop
                            trailer={this.props.movie.trailer_code}
                            onClose={this.closeTrailer}
                        />
                    }

                    {/* Play */}
                    <NavBarButton
                        text={'Play'} icon={'icon-controller-play'}
                        link={{href: `#/play/${this.state.resource}`}}
                    />

                    {/*The resolution menu*/}
                    {
                        <NavBarMenu
                            btnText="HD"
                            onChange={this.onMenuChange}
                            getInitialItem={this.onMenuChange}
                            list={this.prepareMenu(
                                this.selectBestQuality(
                                    this.props.movie.resource.videos
                                )
                            )}
                        />
                    }

                    {
                        this.props.movie.trailer_code &&
                        <NavBarButton
                            text={'Trailer'} icon={'icon-video'} mrb={7}
                            link={{onClick: this.openTrailer, href: '#'}}
                        />
                    }
                </div>
            </nav>
        )
    }
}
