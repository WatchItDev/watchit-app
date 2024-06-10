import React from 'react'
import { Close } from "@mui/icons-material";
import CustomButton from "@components/CustomButton";

export default class ButtonClose extends React.Component {
  shouldComponentUpdate () {
    return false
  }

  render () {
    return (
        <CustomButton
            variant={'flat btn-close'}
            height={"30px"}
            width={"30px"}
            margin='0 0.5rem 0 0'
            backgroundColor={'rgba(28,29,33,0.4) !important'}
            icon={<Close style={{ color: '#D1D2D3' }} />}
            onClick={this.props.onClose}
        />
    )
  }
}
