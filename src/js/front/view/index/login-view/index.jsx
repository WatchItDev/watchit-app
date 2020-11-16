//Basic
import React from 'react'
import FormBox from 'js/front/components/forms/app-form/index.jsx'
import Forms from './forms.js'

//Login view class
export default class LoginForm extends React.PureComponent {
	
	constructor(props) {
		super(props);
		//Initial State
		this.state = {
			//Inputs lists
			success: false,
			submitted: false,
			error: false,
		};
	}
	
	
	handleRequest = (fields) => {
		//Set first state
		this.setState({
			error: false,
			submitted: true
		});
		
		let [pub, pvt] = [fields.get('public'), fields.get('private')];
		if (!window.Auth.validate(pub))
			return this.setState({
				error: ['Invalid public key'],
				submitted: false
			});
			
		// Write key
		window.Auth.generateKey({
			public: pub, private: pvt
		});
		
		setTimeout(() => {
			//Set first state
			window.location.href = '#/app/movies'
		}, 2000)
	}
	
	render() {
		return (
			<div className="absolute valign-wrapper full-width full-height main-login-box">
				<section className="valign center-block col l4 m6">
					{/* Form Box */}
					<section className="row input-black-box">
						<FormBox
							action={this.handleRequest}
							input={Forms.login_user.inputs} // Make inputs
							buttons={Forms.login_user.buttons} // Make buttons
							error={this.state.error}
							submitted={this.state.submitted}
						/>
					</section>
				</section>
			</div>
		)
	}
}
