// REACT IMPORTS
import React from 'react'

// MUI IMPORTS
import { styled, Box, Typography } from '@mui/material'

// ----------------------------------------------------------------------
// MAIN COMPONENT

export const ChannelItem = (props) => {
  return (
      <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' sx={{ cursor: 'pointer' }}>
        <ChannelItemWrapper
            onClick={props.onClick} selected={!!props.selected}
            data-testid='channel-item-wrapper'
            sx={{
              padding: props.borderWidth ? `${props.borderWidth}px` : '5px',
              width: `${props.size ?? 100}px`,
              height: `${props.size ?? 100}px`
            }}
        >
          <ChannelItemContent
              display='flex' alignItems='center' justifyContent='center'
              data-testid='channel-item-content'
              sx={{
                borderWidth: props.borderWidth ? `${props.borderWidth}px` : '5px',
                fontSize: `${props.innerLetterSize ?? 40}px`
              }}
          >
            {props.innerLetter[props.innerLetter.length - 1]}
          </ChannelItemContent>
        </ChannelItemWrapper>
        {
          props.label ? (
              <ChannelItemText fontSize={props.labelLetterSize} variant='body1'>
                {props.label}
              </ChannelItemText>
          ) : <></>
        }
      </Box>
  )
}

// ----------------------------------------------------------------------
// SUB COMPONENTS

export const ChannelItemWrapper = styled(Box)((props) => ({
    backgroundColor: props.selected ? 'rgba(209,210,211,1)' : 'transparent',
    borderRadius: '13px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#212328',
    position: 'relative',
    '&:hover': {
        backgroundColor: 'rgba(209,210,211,0.5)',
    },
    '&:hover .delete-channel': {
        opacity: 1,
        transform: 'translateX(0)'
    }
}))

export const ChannelItemContent = styled(Box)(() => ({
    backgroundColor: '#D1D2D3',
    borderRadius: '10px',
    border: '5px solid #1A1C20',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textTransform: 'uppercase',
    fontWeight: 500
}))

export const ChannelItemText = styled(Typography)((props) => ({
    fontSize: props.fontSize,
    fontWeight: 500,
    color: '#D1D2D3',
    textTransform: 'uppercase',
    marginTop: '1rem',
    maxWidth: '100%'
}))

// ----------------------------------------------------------------------

export default ChannelItem
