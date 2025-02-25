import React, {FC, PropsWithChildren} from "react";
import {ButtonProps as MuiButtonProps, Button as MuiButton, Box} from "@mui/material";
/* import { withTheme } from '../../../hoc/withTheme' */

type ButtonVariant = "primary" | "secondary" | "flat";

export interface ButtonProps {
  variant: ButtonVariant;
  icon?: JSX.Element;
  borderRadius?: string;
  border?: string;
  padding?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  backgroundColor?: string;
  width?: string;
  height?: string;
  margin?: string;
}

export const ButtonCustom: FC<PropsWithChildren<ButtonProps>> = (props): JSX.Element => {
  const getButtonVariant = (v: ButtonVariant) => {
    const variants = {primary: "contained", secondary: "outlined", flat: "text"};
    return variants[v] as MuiButtonProps["variant"];
  };

  return (
    <MuiButton
      onClick={props?.onClick}
      variant={getButtonVariant(props?.variant)}
      sx={{
        // padding: props.children ? '0.3rem 1rem' : '0.3rem 0.5rem',
        backgroundColor: props?.backgroundColor,
        border: props?.border,
        borderRadius: props?.borderRadius,
        padding: props?.padding,
        height: props?.height,
        width: props?.width,
        margin: props?.margin,
      }}>
      <Box display="flex" alignItems="center" justifyContent="center">
        {props?.icon ? (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{mr: props?.children ? "0.5rem" : "0"}}
            data-testid="icon">
            {props?.icon}
          </Box>
        ) : (
          <></>
        )}
        {props?.children ? props?.children : <></>}
      </Box>
    </MuiButton>
  );
};

export default ButtonCustom;
