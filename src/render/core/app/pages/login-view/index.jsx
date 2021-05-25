import React from 'react'
import Forms from './forms.js'
import styled from 'styled-components'
import Form from 'components/app-form/'
import Background from 'components/app-background/'

// Login pages class
const key = window.bridge.Key
export default class LoginForm extends React.PureComponent {
  constructor (props) {
    super(props)
    // Initial State
    this.state = {
      // Inputs lists
      success: false,
      submitted: false,
      error: false
    }
  }

  handleRequest = (fields) => {
    // Set first state
    this.setState({
      error: false,
      submitted: true
    })

    const pb = fields.get('public')
    // Check if stored key its valid
    if (!key.isValidKey(pb)) {
      return this.setState({
        error: ['Invalid Key'],
        submitted: false
      })
    }

    // Write public key
    key.generateKey({ ingest: pb })
    setTimeout(() => {
      // Set first state
      window.location.href = '#/app/movies'
    }, 2000)
  }

  render () {
    return (
      <LoginWrapper>
        <Background absolute={false} />
        <FormWrapper>
          {/* form */}
          <Form
            onAction={this.handleRequest}
            input={Forms.login_user.inputs} // Make inputs
            buttons={Forms.login_user.buttons} // Make buttons
            error={this.state?.error}
            submitted={this.state?.submitted}
          />
        </FormWrapper>
      </LoginWrapper>
    )
  }
}

const FormWrapper = styled.div`
  width: 50%;
  margin-top: 2rem;
`

const LoginWrapper = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 3rem;
`
