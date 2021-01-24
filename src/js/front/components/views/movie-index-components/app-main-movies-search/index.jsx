import React from 'react'
import AppMainTopInput from 'js/front/components/views/movie-index-components/app-main-movies-top-inputs/index'
import AppSearch from 'js/front/components/views/movie-index-components/app-main-movies-top-search-result/index'
import utilHelper from "js/resources/helpers/utilHelper";
import PropTypes from "prop-types";

export default class AppMainTopInputs extends React.PureComponent {
    constructor(props) {
        super(props);

        this.ingest = window.Ingest;
        this.search_timeout = null;
        this.searchRef = null;

        this.state = {
            searching: false,
            searchResult: false,
        }
    }

    static get propTypes() {
        return {
            movies: PropTypes.object.isRequired
        }
    }


    onSearch = (e) => {
        // //The incoming value;
        let _target_value = e.target.value;
        let _invalid_input = utilHelper.invalidString(_target_value);

        //Remove old timeout
        if (this.search_timeout) {
            clearTimeout(this.search_timeout);
        }

        //Empty write
        if (_invalid_input) {
            this.setState({
                searchResult: false,
                searching: false
            });
        } else {
            //Searching
            this.setState({
                searching: true
            });
        }

        //Set time out
        this.search_timeout = setTimeout(() => {
            //Check invalid
            if (!_invalid_input)
                //Get movies by search
                this.props.movies.search(
                    _target_value
                ).then((res) => {
                    this.setState({
                        searchResult: res,
                        searching: false
                    })
                }).catch(() => {
                    this.setState({
                        searchResult: [],
                        searching: false
                    })
                });
        }, 1000)
    }

    onResultCLick = (id) => {
        this.searchRef.input.ref.value = "";
        this.setState({searching: false, searchResult: false}, () => {
            this.props.onClick && this.props.onClick(id);
        })
    };

    getRef = (ref) => {
        this.searchRef = ref
    }

    render() {
        return (
            <>
                {/*Search result box*/}
                <AppMainTopInput
                    onInput={this.onSearch} size="m12 l12"
                    ref={this.getRef}/>
                {
                    (this.state.searching || this.state.searchResult) &&
                    <AppSearch
                        searching={this.state.searching}
                        result={this.state.searchResult}
                        onClick={this.onResultCLick}/>
                }

            </>
        )
    }
}
