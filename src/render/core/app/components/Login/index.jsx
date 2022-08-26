/* global FormData */
import React, { useState } from 'react'
import styled from 'styled-components'
import Alert from '@components/Alert/'
import Input from '@components/Input/'
import Button from '@components/Button/'
import Background from '@components/Background/'
import { Key as key } from '@main/bridge'
import setting from '@settings'

const LoginForm = () => {
  const fields = new FormData()
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(false)
  const [value, setValue] = useState('')
  const [showLocalNode, setShowLocalNode] = useState(false)

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
    // This validation should be skip
    // Check if stored key its valid
    // if (!key.isValidKey(pb)) {
    //   setError('Invalid Key')
    //   return setSubmitted(false)
    // }

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
              value={value}
              onChange={(e) => {
                setValue(event.target.value)
                handleInput(e)
              }}
            />
          </FormRow>

          <FormRow>
            <ButtonsContainer>
              <LoginButtonContainer>
                <Button clicked={submitted} type='submit'>
                  <span>Connect</span>
                </Button>
              </LoginButtonContainer>
              <SmallButtonContainer onClick={() => setValue('zdpuB2dv2oU6bLV2qNYbjWwnXudc4vZAzDh3rGcpFWUwccZ9d')}>
                <Button clicked={submitted} type='button'>
                  <span>Last Key</span>
                </Button>
              </SmallButtonContainer>
              <SmallButtonContainer>
                {
                  showLocalNode ? (
                    <>
                      <Input
                        placeholder='Port'
                        name='node_port'
                        onChange={handleInput}
                      />
                      <div className={'cancel-button'} onClick={() => setShowLocalNode(false)}>
                        <i className='icon-cross white-text' />
                      </div>
                    </>
                  ) : (
                    <div onClick={() => setShowLocalNode(true)}>
                      <Button clicked={submitted} type='button'>
                        <span>Local Node</span>
                      </Button>
                    </div>
                  )
                }
              </SmallButtonContainer>
            </ButtonsContainer>
          </FormRow>

          {
            error &&
              <FormRow>
                <Alert color={setting.styles.colors.danger}>
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
  width: 90%;
  margin-top: 2rem;

  @media ${setting.styles.devices.mobileS} {
    width: 90%;
  }

  @media ${setting.styles.devices.mobileM} {
    width: 70%;
  }
  
  @media ${setting.styles.devices.mobileL} {
    width: 60%;
  }
  
  @media ${setting.styles.devices.tablet} {
    width: 40%;
  }
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
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const ButtonsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  grid-gap: 1rem;
`

const LoginButtonContainer = styled.div`
  width: calc(50% - 1rem);
  
  @media (max-width: 500px) {
    width: 100%;
  }
`

const SmallButtonContainer = styled.div`
  width: calc(25% - 0.5rem);
  position: relative;
  
  .input-wrapper {
    height: 36px;
    
    input {
      height: 36px;
    }
  }
  
  .cancel-button {
    width: 2rem;
    height: 100%;
    position: absolute;
    right: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  
  @media (max-width: 500px) {
    width: 100%;
  }
`


export default React.memo(LoginForm)
