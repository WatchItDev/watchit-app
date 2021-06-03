import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

export default class Input extends React.PureComponent {
  constructor (props) {
    super(props)
    this.ref = null
    this.state = {
      invalid: false
    }
  }

  static get defaultProps () {
    return {
      type: 'text',
      autoComplete: 'off'
    }
  }

  static get propTypes () {
    return {
      placeholder: PropTypes.string.isRequired
    }
  }

  handleInput = (e) => {
    // If handler
    if (this.props.onInput) this.props.onInput(e)
    this.setState({ invalid: false })
  }

  handleChange = (e) => {
    // If handler
    if (this.props.onChange) { this.props.onChange(e) }
  }

  handleKeyDown = (e) => {
    // If handler
    if (this.props.onKeyDown) { this.props.onKeyDown(e) }
  }

  handleInvalid = (e) => {
    e.preventDefault()
    this.setState({ invalid: true })
  }

  getRef = (ref) => {
    this.ref = ref
  }

  render () {
    return (
      <InputWrapper>
        {this.props.icon && <i className={this.props.icon + ' gray-text'} />}
        <InputElement
          {...this.props}
          onInput={this.handleInput}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          onInvalid={this.handleInvalid}
          ref={this.getRef}
          invalid={this.state.invalid}
        />
      </InputWrapper>
    )
  }
}

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
