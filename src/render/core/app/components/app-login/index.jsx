/* global FormData */
import React, { useState } from 'react'
import styled from 'styled-components'
import Alert from 'components/app-alerts/'
import Input from 'components/app-inputs/'
import Button from 'components/app-buttons/'
import Background from 'components/app-background/'
import settings from 'settings'

const key = window.bridge.Key
const LoginForm = () => {
  const fields = new FormData()
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(false)

  const handleInput = (event) => {
    // If the input fields were directly within this
    // Set input in formData
    fields.set(
      event.target.name,
      event.target.value
    )
  }

  const handleSubmit = (e) => {
    // Avoid trigger default event
    e.preventDefault()
    // Set first state
    setError(false)
    setSubmitted(true)

    const pb = fields.get('public')
    // Check if stored key its valid
    if (!key.isValidKey(pb)) {
      setError('Invalid Key')
      return setSubmitted(false)
    }

    // Write public key
    key.generateKey({ ingest: pb })
    setTimeout(() => {
      // Set first state
      window.location.href = '#/app/movies'
    }, 2000)
  }

  return (
    <LoginWrapper>
      <Background absolute={false} />
      <FormWrapper>
        <form onSubmit={handleSubmit} autoComplete='new-password'>
          <FormRow>
            <Input
              placeholder='Public Key'
              name='public' required
              onChange={handleInput}
            />
          </FormRow>

          <FormRow>
            <Button clicked={submitted} type='submit'>
              <span>Connect</span>
            </Button>
          </FormRow>

          {
            error &&
              <FormRow>
                <Alert color={settings.styles.colors.danger}>
                  {error}
                </Alert>
              </FormRow>
          }
        </form>
      </FormWrapper>
    </LoginWrapper>
  )
}

const FormWrapper = styled.div`
  width: 40%;
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

const FormRow = styled.div`
  margin-bottom: 20px;
`

export default React.memo(LoginForm)
