import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components';

export default class BoxInput extends React.PureComponent {

    constructor(props) {
        super(props);
        this.ref = null;
        this.state = {
            invalid: false
        };
    }

    static get defaultProps() {
        return {
            type: 'text',
            autoComplete: 'off'
        }
    }

    static get propTypes() {
        return {
            placeholder: PropTypes.string.isRequired
        }
    }

    onInput = (e) => {
        //If handler
        if (this.props.onInput) this.props.onInput(e);
        this.setState({invalid: false});
    }

    onChange = (e) => {
        //If handler
        if (this.props.onChange)
            this.props.onChange(e);
    }

    onKeyDown = (e) => {
        //If handler
        if (this.props.onKeyDown)
            this.props.onKeyDown(e);
    }

    onInvalid = (e) => {
        e.preventDefault();
        this.setState({invalid: true});
    }

    getRef = (ref) => {
        this.ref = ref
    }

    render() {
        return (
            <InputContainer>
                {this.props.icon && <i className={this.props.icon + " gray-text"}/>}
                <Input {...this.props}
                       onInput={this.onInput}
                       onChange={this.onChange}
                       onKeyDown={this.onKeyDown}
                       onInvalid={this.onInvalid}
                       ref={this.getRef}
                       invalid={this.state.invalid}
                />
            </InputContainer>
        )
    }
}

const InputContainer = styled.div`
  width: 100%;
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.5) !important;
  padding: 0 0.75rem;
  position: relative;
`;

const Input = styled.input`
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
`;
