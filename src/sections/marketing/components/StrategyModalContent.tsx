import { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { sha256 } from 'viem';

// Material UI
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { Button, TextField } from '@mui/material';

// Project imports
import DialogActions from '@mui/material/DialogActions';
import StrategyColorPicker from '@src/sections/marketing/components/StrategyColorPicker';
import { RootState } from '@redux/store';
import { storeStrategy } from '@src/utils/supabase-actions';

interface StrategyModalContentProps {
  onClose: () => void;
  onConfirm: () => void;
}

const StrategyModalContent: FC<StrategyModalContentProps> = ({ onClose, onConfirm }) => {
  const sessionData = useSelector((state: any) => state.auth.session);
  const color = useSelector((state: RootState) => state.strategyColor.color);

  const [formValues, setFormValues] = useState<{ description: string; budget: string }>({
    description: '',
    budget: '',
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleOnConfirm = async () => {
    const { description, budget } = formValues;
    const address = sessionData?.profile?.ownedBy?.address;
    const strategyId = sha256(`0x + ${address}${description}${budget}`);

    // Store in blockchain
    // @TODO

    //After stored in blockchain, store in supabase
    const success = await storeStrategy({
      address,
      description,
      budget,
      color,
      strategyId,
    });

    if (success) {
      onConfirm?.();
    }

    // Call the onConfirm function passed as a prop
    onConfirm?.();
  };

  return (
    <>
      <Divider
        sx={{
          padding: '0.3rem 0',
          mb: 4,
          borderStyle: 'dashed',
        }}
      />

      <Grid container spacing={2} sx={{ mb: 2, px: 5 }}>
        <Typography sx={{ opacity: 0.7 }} variant="body1" color="text.secondary">
          A strategy is a set of campaigns to promote your content. Complete all the information
          required.
        </Typography>

        {/*Input for description*/}
        <TextField
          sx={{ mt: 3, mb: 3 }}
          fullWidth
          autoFocus
          label="Enter a description"
          type="text"
          name="description"
          value={formValues.description}
          onChange={handleInputChange}
          placeholder="e.g., 'Promote my new album'"
          helperText={'This description will help you identify the strategy.'}
        />

        {/*Input for budget*/}
        <TextField
          sx={{ mb: 3 }}
          fullWidth
          autoFocus
          label="Enter a budget"
          type="number"
          name="budget"
          value={formValues.budget}
          onChange={handleInputChange}
          placeholder="e.g., 5000"
          helperText={'This budget will be distributed among the campaigns.'}
        />

        {/*Widget to choose a color*/}
        <Typography sx={{ opacity: 0.7 }} variant="body1" color="text.secondary">
          Choose a color to identify the strategy.
        </Typography>
        <StrategyColorPicker />
      </Grid>

      <Divider
        sx={{
          padding: '0.3rem 0',
          borderStyle: 'dashed',
        }}
      />

      <DialogActions>
        <Button variant={'outlined'} onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant={'contained'}
          onClick={handleOnConfirm}
          sx={{ backgroundColor: 'white', color: 'black' }}
        >
          Confirm
        </Button>
      </DialogActions>
    </>
  );
};

export default StrategyModalContent;
