import Divider from '@mui/material/Divider';
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import {Button, TextField } from '@mui/material';
import {FC, useState} from "react";
import DialogActions from "@mui/material/DialogActions";
import StrategyColorPicker from "@src/sections/marketing/components/StrategyColorPicker";


interface StrategyModalContentProps {
  onClose: () => void;
  onConfirm: () => void;
}

const StrategyModalContent: FC<StrategyModalContentProps> = ({onClose, onConfirm}) => {
  const [description, setDescription] = useState<string>('');

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  return(<>
  <Divider sx={{
    padding: '0.3rem 0',
    mb: 4,
    borderStyle:'dashed'
  }} />

    <Grid container spacing={2} sx={{mb: 2, px:5}}>
      <Typography sx={{opacity: 0.7}} variant="body1" color="text.secondary">A strategy is a set of campaigns to promote your content. Complete all the information required.</Typography>

      {/*Input for description*/}
      <TextField
        sx={{ mt: 3, mb: 3 }}
        fullWidth
        autoFocus
        label="Enter a description"
        type="text"
        value={description}
        onChange={handleDescriptionChange}
        placeholder="e.g., 'Promote my new album'"
      />

      {/*Input for budget*/}
      <TextField
        sx={{ mb: 3 }}
        fullWidth
        autoFocus
        label="Enter a budget"
        type="text"
        value={description}
        onChange={handleDescriptionChange}
        placeholder="e.g., 5000"
      />

      {/*Widget to choose a color*/}
      <Typography sx={{opacity: 0.7}} variant="body1" color="text.secondary">Choose a color to identify the strategy.</Typography>
      <StrategyColorPicker  />
    </Grid>

    <Divider sx={{
      padding: '0.3rem 0',
      borderStyle:'dashed'
    }} />

    <DialogActions>
      <Button variant={'outlined'} onClick={onClose}>
        Cancel
      </Button>
      <Button variant={'contained'} onClick={onConfirm} sx={{backgroundColor: 'white', color: 'black'}}>
        Confirm
      </Button>
    </DialogActions>

  </>)
}

export default StrategyModalContent;
