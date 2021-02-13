import React from 'react'
import NavBarMenu from 'js/front/components/partials/app-nav-bar-menu/index.jsx'

export default class AppMoviesNavBar extends React.Component {
    constructor(props) {
        super(props);
        //Initial state
        this.prevState = {
            sort: [{
                'label': 'Year',
                'action': 'year',
                'default': true
            }, {
                'label': 'Title',
                'action': 'title'
            }, {
                'label': 'Recently Added',
                'action': 'date_uploaded_unix',
            }, {
                'label': 'Runtime',
                'action': 'runtime'
            }, {
                'label': 'Rating',
                'action': 'rating'
            }],
            genres: [{
                'label': 'All',
                'action': 'All',
                'default': true
            }, {
                'label': 'Action',
                'action': 'Action'
            }, {
                'label': 'Adventure',
                'action': 'Adventure'
            }, {
                'label': 'Animation',
                'action': 'Animation'
            }, {
                'label': 'Biography',
                'action': 'Biography'
            }, {
                'label': 'Comedy',
                'action': 'Comedy'
            }, {
                'label': 'Crime',
                'action': 'Crime'
            }, {
                'label': 'Documentary',
                'action': 'Documentary'
            }, {
                'label': 'Drama',
                'action': 'Drama'
            }, {
                'label': 'Family',
                'action': 'Family'
            }, {
                'label': 'Fantasy',
                'action': 'Fantasy'
            }, {
                'label': 'Film-Noir',
                'action': 'Film-Noir'
            }, {
                'label': 'History',
                'action': 'History'
            }, {
                'label': 'Horror',
                'action': 'Horror'
            }, {
                'label': 'Music',
                'action': 'Music'
            }, {
                'label': 'Musical',
                'action': 'Musical'
            }, {
                'label': 'News',
                'action': 'News'
            }, {

                'label': 'Mystery',
                'action': 'Mystery'
            }, {
                'label': 'Romance',
                'action': 'Romance'
            }, {
                'label': 'Sci-Fi',
                'action': 'Sci-Fi'
            }, {
                'label': 'Sport',
                'action': 'Sport'
            }, {
                'label': 'Thriller',
                'action': 'Thriller'
            }, {
                'label': 'War',
                'action': 'War'
            }, {
                'label': 'Western',
                'action': 'Western'
            }]
        };

        //Set initial state
        this.state = this.getInitialNavVar();
    }

    shouldComponentUpdate() {
        return false
    }

    getInitialNavVar() {
        //Return set state
        if (this.props.setInitialNavVar) {
            return this.props.setInitialNavVar(
                this.prevState.genres,
                this.prevState.sort
            )
        }

        //Return default
        return this.prevState

    }

    onChange(type, e) {
        //OnChange
        if (this.props.onChange) {
            this.props.onChange(type, e);
        }

        //Return set state
        if (this.props.setInitialNavVar) {
            this.setState(
                this.props.setInitialNavVar(
                    this.state.genres,
                    this.state.sort
                )
            )
        }

    }


    sortBy = (e) => this.onChange('sort_by', e)
    genres = (e) => this.onChange('genres', e)

    render() {
        return (
            <div className="nav-wrapper main-nav-filter-movies">
                <NavBarMenu
                    btnText="Sort By" list={this.state.sort}
                    onChange={this.sortBy}
                />

                <NavBarMenu
                    btnText="Genre" list={this.state.genres}
                    onChange={this.genres}
                />
            </div>
        )
    }
}
