import React, {useMemo} from 'react'
import { Add } from '@mui/icons-material'
import { styled, Box, Grid } from '@mui/material'

import CustomButton from "@/render/package/components/CustomButton"
import ChannelItem from "@/render/package/components/ChannelItem"

export const ChannelsMenu = ( props ) => {

    const addIconStyle = useMemo(() => ({
        color: '#D1D2D3'
    }), []);

    return (
        <ChannelMenuWrapper open={props.isOpen}>
            <ChannelItemWrapper>
                <Grid container justifyContent='center' spacing={1}>
                    { props?.channels?.map?.((channel, index) => {
                        return(
                            <Grid item xs={ 12 } key={index}>
                                <ChannelItem
                                    innerLetter={channel}
                                    size={ 40 }
                                    labelLetterSize='0.5rem'
                                    innerLetterSize={ 15 }
                                    selected={ channel === props.selected }
                                    borderWidth={ 2 }
                                    onClick={ () => { props?.onChannelClick?.(channel) } }
                                />
                            </Grid>
                        )
                    })}
                    <Grid alignItems={'start'} item xs={12} >
                        <AddChannelWrapper>
                            <CustomButton
                                margin='5px'
                                height='40px'
                                width='40px'
                                borderRadius='10px !important'
                                icon={<Add style={addIconStyle}/>}
                                variant={'flat'}
                                backgroundColor={'transparent'}
                                onClick={ () => { props?.onAddChannel?.() } }
                            />
                        </AddChannelWrapper>
                    </Grid>
                </Grid>
            </ChannelItemWrapper>
        </ChannelMenuWrapper>
    )
}

export const ChannelMenuWrapper = styled(Box)(() => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'start',
    height: '100%',
    width: '100%',
    backgroundColor: '#1A1C20'
}))

export const ChannelItemWrapper = styled(Box)(() => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: '5px',
    margin: '1rem 0.5rem'
}))

export const AddChannelWrapper = styled(Box)(() => ({
    display:'flex',
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'center',
    cursor:'pointer',
}))

export default ChannelsMenu
