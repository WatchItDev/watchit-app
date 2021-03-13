import React from 'react'
import PropTypes from 'prop-types'
import AppLoaderBackground from 'components/app-movie-player-loader-background/'
import AppLoaderBar from 'components/app-movie-player-loader-bar/'
import AppBtnClose from 'components/util-btn-close/'

export default class AppMoviesPlayerLoader extends React.PureComponent {
	static get propTypes() {
		return {
			stateText: PropTypes.string.isRequired,
			statePercent: PropTypes.number.isRequired
		}
	}
	
	render() {
		return (
			<div className="output-process valign-wrapper full-width full-height">
				<div className="app_loader">
					<AppBtnClose onClick={this.props.signOut} />
					<AppLoaderBackground/>
					<AppLoaderBar
						stateText={this.props.stateText}
						statePercent={this.props.statePercent}
					/>
				</div>
			</div>
		)
	}
}
