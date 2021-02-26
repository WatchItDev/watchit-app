import React from 'react'
import NavBarMenu from 'components/app-nav-bar-menu/'

export default class AppMoviesPlayerShare extends React.Component {
	
	getOptions = () => {
		return this.props.devices.map((e, i) => {
			return {
				default: false,
				label: e, action: i
			}
		})
	}
	
	onChange = (index) => {
		this.props.onChange &&
		this.props.onChange(index)
	}
	
	render() {
		return (
			<>
				<div className={'share-menu'}>
					<NavBarMenu
						btnText=""
						icon="icon-tv"
						onChange={this.onChange}
						list={this.getOptions()}
					/>
				</div>
			</>
		)
	}
}
