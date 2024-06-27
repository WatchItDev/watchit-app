// REACT IMPORTS
import React from 'react'

// MUI IMPORTS
import { Close } from "@mui/icons-material";

// LOCAL IMPORTS
import CustomButton from "@/renderer/package/components/CustomButton";

// ----------------------------------------------------------------------

const ButtonClose = ({ onClose }) => {
  return (
      <CustomButton
          variant="flat btn-close"
          height="30px"
          width="30px"
          margin="0 0.5rem 0 0"
          backgroundColor="rgba(28,29,33,0.4) !important"
          icon={<Close style={{ color: '#D1D2D3' }} />}
          onClick={onClose}
      />
  );
};

// ----------------------------------------------------------------------

export default React.memo(ButtonClose);
