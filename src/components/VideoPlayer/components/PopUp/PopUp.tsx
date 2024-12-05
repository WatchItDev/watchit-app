import React, { FC } from 'react';
import { styled, Box, BoxProps, Typography } from '@mui/material';
/* import { ClickOutsideListener } from '../../../hooks'
import { withTheme } from '../../../hoc/withTheme' */

export type PopUpProps = {
  triggerComponent: JSX.Element;
  children: JSX.Element;
  position: string;
  width?: string;
  open: boolean;
  onClose: () => void;
};

const PopUp: FC<PopUpProps> = (props): JSX.Element => {
  return (
    <>
      <PopUpContainer>
        {props.triggerComponent}
        {props.open && (
          <PopUpWrapper className={props.position} width={props.width}>
            {props.children}
          </PopUpWrapper>
        )}
      </PopUpContainer>
    </>
  );
};

const PopUpContainer = styled(Box)<BoxProps>(() => ({
  display: 'flex',
  position: 'relative',
}));

const PopUpWrapper = styled(Box)<BoxProps & { width?: string }>((props) => ({
  background: '#212328',
  borderRadius: '10px',
  padding: '1rem 1rem',
  position: 'absolute',
  zIndex: '99',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'start',
  width: props.width,
  boxShadow: '4px 4px 4px 1px rgba(33, 35, 40, .1)',
  '&.top': {
    bottom: `calc( 100% - -5px)`,
  },
  '&.topleft': {
    bottom: `calc( 100% - -5px)`,
    right: 'calc(100% - 30px)',
  },
  '&.topright': {
    bottom: `calc( 100% - -5px)`,
    lef: 'calc(100% - 30px)',
  },
  '&.bottom': {
    top: `calc( 100% - -5px)`,
  },
  '&.bottomleft': {
    top: `calc( 100% - -5px)`,
    right: 'calc(100% - 30px)',
  },
  '&.bottomright': {
    top: `calc( 100% - -5px)`,
    left: 'calc(100% - 30px)',
  },
}));

export const ItemListTitles = styled(Typography)<{
  fontSize?: string;
  fontWeight?: string;
  margin?: string;
}>((props) => ({
  fontSize: props.fontSize,
  fontWeight: props.fontWeight,
  color: '#D1D2D3',
  margin: props.margin,
  whiteSpace: 'nowrap',
}));

export default PopUp;
