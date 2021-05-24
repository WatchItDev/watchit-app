import React from 'react'
import styled from 'styled-components';
import Forms from './forms.js'
import FormBox from 'components/app-form/'
import AppLoaderBackground from 'components/app-movie-player-loader-background/'

//Login pages class
const key = window.bridge.Key
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

        const pb = fields.get('public')
        // Check if stored key its valid
        if (!key.isValidKey(pb)) {
            return this.setState({
                error: ['Invalid Key'],
                submitted: false
            })
        }

        // Write public key
        key.generateKey({ingest: pb});
        setTimeout(() => {
            //Set first state
            window.location.href = '#/app/movies'
        }, 2000)
    }

    render() {
        return (
            <MainLoginBox>
                <AppLoaderBackground absolute={false}/>
                <FormContainer>
                    {/*form */}
                    <FormBox
                        action={this.handleRequest}
                        input={Forms.login_user.inputs} // Make inputs
                        buttons={Forms.login_user.buttons} // Make buttons
                        error={this.state?.error}
                        submitted={this.state?.submitted}
                    />
                </FormContainer>
            </MainLoginBox>
        )
    }
}

const FormContainer = styled.div`
  width: 50%;
  margin-top: 2rem;
`;

const MainLoginBox = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;