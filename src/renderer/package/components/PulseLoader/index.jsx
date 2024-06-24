import React from 'react';
import { styled, keyframes } from '@mui/system';

const SpinnerComponent = (props) => {
    return (
        <Spinner {...props}>
            <div className='double-bounce1' />
            <div className='double-bounce2' />
        </Spinner>
    );
};

const bounce = keyframes`
  0%, 100% {
    transform: scale(0.0);
  }
  50% {
    transform: scale(1.0);
  }
`;

const Spinner = styled('div')({
    width: '40px',
    height: '40px',
    position: 'absolute',
    top: 'calc(50% - 20px)',
    left: 'calc(50% - 20px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& .double-bounce1, & .double-bounce2': {
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        opacity: 0.6,
        position: 'absolute',
        top: 0,
        left: 0,
        animation: `${bounce} 1.5s infinite ease-in-out`,
    },
    '& .double-bounce2': {
        animationDelay: '-0.75s',
    },
});

export default React.memo(SpinnerComponent);
