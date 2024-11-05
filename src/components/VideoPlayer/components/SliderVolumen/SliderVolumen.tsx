import { useState, FC } from 'react';
import { styled, Box, BoxProps, Slider } from '@mui/material'
import { IconVolume } from '@tabler/icons-react';
/* import { VolumeUp, VolumeOff } from '@mui/icons-material' */
import { ButtonCustom } from '../Button/Button'
/* import { ClickOutsideListener } from '../../../hooks' */
/* import { withTheme } from '../../../hoc/withTheme' */

export type SliderVolumenProps = {
  defaultVolume?: number,
  alwaysShow: boolean,
  onChange: ( value:number ) => void;
}

const SliderVolumen: FC<SliderVolumenProps> = (props) : JSX.Element => {
  const { defaultVolume = 0, alwaysShow = true, onChange } = props
  // State use to show TextField and change button icon
  const [ show, setShow ] = useState( alwaysShow )
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [ volumen, setVolumen ] = useState(defaultVolume)

  const handleShow = () => show ? setShow(false) : setShow(true)

  const handleShow2 = (_e: Event, value: any) => {
    setVolumen(value);
    onChange(value);
  };

  return (
      <MainWrapper>
        { show &&
          <SliderVolumenWrapper>
            <SliderCustom
              aria-label='Volumen'
              orientation='vertical'
              defaultValue={ defaultVolume || 0 }
              data-testid='slider-volumen'
              onChange={ (e:Event,value:any) => handleShow2(e,value) }
            />
          </SliderVolumenWrapper>
        }
        <ButtonCustom
          variant='flat'
          width='45px'
          height='45px'
          icon={<IconVolume color="#FFFFFF" />}
          onClick={ ()=> handleShow() }
          backgroundColor='transparent'
          data-testid='button-show-slider'
        />
      </MainWrapper>
  )
}

const MainWrapper = styled( Box )<BoxProps>(() => ({
  display: 'flex',
  flexDirection: 'column',
  width: '2rem',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative'
}))

const SliderVolumenWrapper = styled( Box )<BoxProps>(() => ({
  display: 'flex',
  height: '10rem',
  justifyContent:'center',
  alignItems: 'center',
  marginBottom: '0.6rem',
  position: 'absolute',
  bottom: '-67px',
  right: '113px',
  transform: 'rotate(90deg)'
}))

const SliderCustom = styled( Slider )(() => ({
  '& .MuiSlider-thumb': {
    color: 'white'
  } ,
  '& .MuiSlider-track': {
      color: 'white'
  },
  '& .MuiSlider-rail': {
    color: '#acc4e4'
  },
  '& .MuiSlider-active': {
      color: 'white'
  }
}))

export default SliderVolumen
