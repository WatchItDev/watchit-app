import React from 'react'
import settings from 'settings'
import PropTypes from 'prop-types'
import NavBarMenu from 'components/app-nav-bar-menu/'
import NavBarButton from 'components/app-nav-bar-button/'
import cryptHelper from 'core/resources/helpers/cryptHelper'
import TrailerPop from 'components/app-movie-details-trailer'
import util from 'resource/helpers/utilHelper'
import gatewayHelper from "resource/helpers/gatewayHelper";
import styled from "styled-components";

export default class AppMovieDetailMenu extends React.PureComponent {
    constructor(props) {
        super(props);
        //Default state
        this.state = {
            resource: null,
            sub: 'invalid',
            modalOpen: false
        };
    }

    static get propTypes() {
        return {
            movie: PropTypes.object.isRequired
        }
    }


    isMovieResource(resourceType) {
        return settings.allowedResource.includes(
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
        rate = rate < 1 ? 'danger' :
            rate >= 1 && rate <= 2 ?
                'warning' : 'success';
        return <Icon className={`icon-heart`} color={rate}/>
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
        if (this.isMovieResource(type)) {
            this.setState({
                resource: cryptHelper.toBase64(
                    JSON.stringify({
                        type, cid: resource,
                        id: this.props.movie._id,
                        title: this.props.movie.title
                    })
                )
            })
        } else {
            this.setState({
                sub: resource
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

    selectBestQuality(resources) {
        const groupedQualities = util.groupBy(resources, 'quality');
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
            <NavWrapper>
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
                    link={{href: `#/play/${this.state.resource}/${this.state.sub}`}}
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
                    'subtitles' in this.props.movie &&
                    Object.keys(this.props.movie.subtitles).length > 0 &&
                    <NavBarMenu
                        btnText="" onChange={this.onMenuChange}
                        getInitialItem={this.onMenuChange}
                        list={this.prepareMenu(
                            this.selectAvailableSubs()
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
            </NavWrapper>
        )
    }
}

const handleColorType = color => {
    switch (color) {
        case "primary":
            return "#03a9f3";
        case "danger":
            return "#F44336";
        case "success":
            return "#4CAF50";
        case "warning":
            return "#ff9800";
        default:
            return "#fff";
    }
};

const Icon = styled.i`
  margin-left: 0.5rem;
  color: ${({color}) => handleColorType(color)};
`;

const NavWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 56px;
  line-height: 56px;
  padding: 0 0.75rem;
  box-shadow: none;
  background-color: transparent;
  display: flex;
  
  & > ul {
    display: flex;
    align-items: center;
  }
`;