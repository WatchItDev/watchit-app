import React from 'react'
import PropTypes from 'prop-types'
import NavBarMenu from 'js/front/components/partials/app-nav-bar-menu/'
import NavBarButton from 'js/front/components/partials/app-nav-bar-button/'
import cryptHelper from 'js/resources/helpers/cryptHelper'
import TrailerPop from 'js/front/components/views/movie-details-components/app-movie-details-trailer'
import util from 'js/resources/helpers/utilHelper'
import settings from 'js/settings'

export default class AppMovieDetailMenu extends React.PureComponent {
    constructor(props) {
        super(props);
        //Default state
        this.state = {
            torrent: null, sub: 'invalid',
            modalOpen: false
        };
    }

    static get propTypes() {
        return {
            movie: PropTypes.object.isRequired
        }
    }

    prepareMenu(items, type = 'torrent') {
        let i = 0;
        //Prepare for menu structure
        return items.map((v) => {
            // If type of items is torrent
            let isTorrent = Object.is(type, 'torrent');
            if (isTorrent) //If not found in available resolutions list... Skip !!
                if (!(~(settings.resolutions.available.indexOf(v.quality))))
                    return false;

            return {
                default: (i++ === 0),
                label: (isTorrent && v.quality) || (v[0].toUpperCase() + v.slice(1)),
                action: (isTorrent && `${this.props.movie.hash}/${v.quality}/${v.hash}`) || v,
                health: isTorrent ? v.health : Number.NaN
            };
        });
    }

    setMenuItem(def, type = 'torrent') {
        this.prepareDataToPlayer(
            def, type
        )
    }

    setTorrent = (t) => this.setMenuItem(t)
    setInitial = (t) => this.setMenuItem(t.action)
    setMenuChange = (t) => this.setMenuItem(t, 'sub')
    setMenuInitial = (t) => this.setMenuItem(t.action, 'sub')

    prepareDataToPlayer(data, type = 'torrent') {
        //Handle type of menu
        if (type === 'torrent') {
            this.setState({
                torrent: cryptHelper.toBase64(
                    JSON.stringify({
                        torrent: data,
                        id: this.props.movie._id,
                        title: this.props.movie.title
                    })
                )
            })
        } else {
            this.setState({
                sub: data
            })
        }
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

    selectBestQuality(torrents) {
        const groupedQualities = util.groupBy(torrents, 'quality');
        return Object.keys(groupedQualities).map((key) => {
            return groupedQualities[key].reduce((old, curr) => {
                let bestOne = (old.health || 0) > curr.health;
                return bestOne ? old : curr;
            });
        });
    }

    selectAvailableSubs() {
        // Get best sub from lists
        return [...new Set(Object.values(this.props.movie.subtitles).reduce(
            (o, n) => [...o, ...Object.keys(n)], []
        ).filter((k) => settings.subs.available.includes(k)))]
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

                    {/*Play*/}
                    <NavBarButton
                        text={'Play'} icon={'icon-controller-play'}
                        link={{href: `#/play/${this.state.torrent}/${this.state.sub}`}}
                    />

                    {/*The resolution menu*/}
                    {
                        Object.keys(this.props.movie.torrents).length > 0 &&
                        <NavBarMenu
                            btnText="HD"
                            onChange={this.setTorrent}
                            getInitialItem={this.setInitial}
                            list={this.prepareMenu(
                                this.selectBestQuality(
                                    this.props.movie.torrents
                                )
                            )}
                        />
                    }

                    {/*The subs menu*/}
                    {
                        Object.keys(this.props.movie.subtitles).length > 0 &&
                        <NavBarMenu
                            btnText="" onChange={this.setMenuChange}
                            getInitialItem={this.setMenuInitial}
                            list={this.prepareMenu(
                                this.selectAvailableSubs(), 'sub'
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
