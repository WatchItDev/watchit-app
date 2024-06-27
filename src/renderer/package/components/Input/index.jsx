// REACT IMPORTS
import React, { useState } from 'react'

// MUI IMPORTS
import { styled, Box } from '@mui/material'

// ----------------------------------------------------------------------
// MAIN COMPONENT

const Input = (props = {
  type: 'text',
  autoComplete: 'off',
  placeholder: 'Please enter some text',
  onInput: () => { },
  onChange: () => { },
  onInvalid: () => { },
  onKeyDown: () => { }
}) => {
  const [invalid, setInvalid] = useState(0);
  const [value, setValue] = useState('');

  const handleInput = (e) => {
    props.onInput(e);
    setInvalid(false);
  };

  const handleInvalid = (e) => {
    props.onInvalid(e);
    setInvalid(true);
  };

  const handleChange = (e) => {
    // props.onChange(e)
    setValue(e.target.value);
  };

  return (
      <InputWrapper>
        {props.icon && <InputIcon className={props.icon} />}
        <StyledInputElement
            value={value}
            {...props}
            onKeyDown={props.onKeyDown}
            invalid={invalid}
            onInput={handleInput}
            onInvalid={handleInvalid}
            onChange={handleChange}
        />
      </InputWrapper>
  );
};

// ----------------------------------------------------------------------
// SUB COMPONENTS

const InputWrapper = styled(Box)({
  width: '100%',
  borderRadius: '5px',
  backgroundColor: 'rgba(0, 0, 0, 0.5) !important',
  padding: '0 0.75rem',
  position: 'relative',
});

const StyledInputElement = styled('input')(({ invalid }) => ({
  backgroundColor: 'transparent',
  border: 'none',
  borderRadius: 0,
  outline: 'none',
  height: '3rem',
  width: '100%',
  fontSize: '1rem',
  padding: 0,
  boxSizing: 'content-box',
  transition: 'all .3s',
  color: '#fff',
  margin: '0 !important',
  borderBottom: invalid === 'true' ? '1px solid #F44336 !important' : '1px solid transparent !important',
  boxShadow: invalid === 'true' ? '0 1px 0 0 #F44336 !important' : 'none',
  '&:focus': {
    borderBottom: '1px solid #26a69a !important',
    boxShadow: '0 1px 0 0 #26a69a !important',
  },
  '&::placeholder': {
    color: '#999',
  },
}));

const InputIcon = styled('i')({
  position: 'absolute !important',
  top: '1rem',
  right: '1.3rem',
  color: '#555555',
});

// ----------------------------------------------------------------------

export default React.memo(Input);
