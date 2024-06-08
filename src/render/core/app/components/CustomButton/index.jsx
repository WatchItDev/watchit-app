import React from 'react'
import { styled, Button, Box } from '@mui/material'

export const CustomButton = (props) => {
    return (
        <CustomButtonWrapper className={`${props.variant}`}
                             onClick={props.onClick}
                             sx={{
                                 backgroundColor: props.backgroundColor,
                                 border:props.border,
                                 borderRadius: props.borderRadius,
                                 padding: props.padding,
                                 height: props.height,
                                 width: props.width,
                                 minWidth:props.width,
                                 margin: props.margin
                             }}
        >
            <Box display='flex' alignItems='center' justifyContent='center'>
                {
                    props.icon ? (
                        <Box
                            display='flex' alignItems='center' justifyContent='center'
                            sx={{ mr: props.children ? '0.5rem' : '0' }} data-testid='icon'
                        >
                            { props.icon }
                        </Box>
                    ) : <></>
                }
                {
                    props.children ? (
                        props.children
                    ) : <></>
                }
            </Box>
        </CustomButtonWrapper>
    )
}

const CustomButtonWrapper = styled(Button)(() => ({
    background: 'transparent',
    borderRadius: '50px !important',
    color: '#D1D2D3 !important',
    fontWeight: '500 !important',
    textTransform: 'capitalize',
    "&.primary":{
        background: 'rgba(26,28,32,0.2) !important',
        border: '1px solid #D1D2D3 !important',
        boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12) !important',
        '&:hover': {
            backgroundColor: '#1c1d21 !important',
        }
    },
    "&.secondary": {
        background: 'transparent !important',
        border: '1px solid #D1D2D3 !important',
        '&:hover': {
            backgroundColor: '#1c1d21 !important',
        }
    },
    "&.flat": {
        background: 'transparent',
        border: 'none !important',
        '&:hover': {
            backgroundColor: '#1c1d21 !important',
        }
    }
}))

export default CustomButton
