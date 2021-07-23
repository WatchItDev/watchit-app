import React, { useState } from 'react'
import styled from 'styled-components'

const InputWrapper = styled.div`
  width: 100%;
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.5) !important;
  padding: 0 0.75rem;
  position: relative;
`

const InputElement = styled.input`
  background-color: transparent;
  border: none;
  border-radius: 0;
  outline: none;
  height: 3rem;
  width: 100%;
  font-size: 1rem;
  padding: 0;
  box-sizing: content-box;
  transition: all .3s;
  color: #fff;
  margin: 0 !important;
  border-bottom: 1px solid transparent !important;
  border-bottom: ${props => props.invalid ? '1px solid #F44336 !important' : 'none'};
  box-shadow: ${props => props.invalid ? '0 1px 0 0 #F44336 !important' : 'none'};

  &:focus {
    border-bottom: 1px solid #26a69a !important;
    box-shadow: 0 1px 0 0 #26a69a !important;
  }

  &::placeholder {
    color: #999;
  }
`

const InputIcon = styled.i`
  position: absolute !important;
  top: 1rem;
  right: 1.3rem;
  color: #555555;
`

const Input = (props) => {
  const [invalid, setInvalid] = useState(0)
  const [value, setValue] = useState('')

  const handleInput = (e) => {
    props.onInput(e)
    setInvalid(false)
  }

  const handleInvalid = (e) => {
    props.onInvalid(e)
    setInvalid(true)
  }

  const handleChange = (e) => {
    props.onChange(e)
    setValue(e.target.value)
  }

  return (
    <InputWrapper>
      {props.icon && <InputIcon className={props.icon} />}
      <InputElement
        value={value}
        {...props}
        onKeyDown={props.onKeyDown}
        invalid={invalid}
        onInput={handleInput}
        onInvalid={handleInvalid}
        onChange={handleChange}
      />
    </InputWrapper>
  )
}

Input.defaultProps = {
  type: 'text',
  autoComplete: 'off',
  placeholder: 'Please enter some text',
  onInput: () => {},
  onChange: () => {},
  onInvalid: () => {},
  onKeyDown: () => {}
}

export default React.memo(Input)
