import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
// types
import {
  ICheckoutCardOption,
  ICheckoutPaymentOption,
  ICheckoutDeliveryOption,
} from 'src/types/checkout';
// components
import Iconify from 'src/components/iconify';
import FormProvider from 'src/components/hook-form';
//
import { useCheckoutContext } from './context';
import CheckoutSummary from './checkout-summary';
import CheckoutDelivery from './checkout-delivery';
import CheckoutBillingInfo from './checkout-billing-info';
import CheckoutPaymentMethods from './checkout-payment-methods';

// ----------------------------------------------------------------------

const DELIVERY_OPTIONS: ICheckoutDeliveryOption[] = [
  {
    value: 0,
    label: 'Free',
    description: '5-7 Days delivery',
  },
  {
    value: 10,
    label: 'Standard',
    description: '3-5 Days delivery',
  },
  {
    value: 20,
    label: 'Express',
    description: '2-3 Days delivery',
  },
];

const PAYMENT_OPTIONS: ICheckoutPaymentOption[] = [
  {
    value: 'paypal',
    label: 'Pay with Paypal',
    description: 'You will be redirected to PayPal website to complete your purchase securely.',
  },
  {
    value: 'credit',
    label: 'Credit / Debit Card',
    description: 'We support Mastercard, Visa, Discover and Stripe.',
  },
  {
    value: 'cash',
    label: 'Cash',
    description: 'Pay with cash when your order is delivered.',
  },
];

const CARDS_OPTIONS: ICheckoutCardOption[] = [
  { value: 'ViSa1', label: '**** **** **** 1212 - Jimmy Holland' },
  { value: 'ViSa2', label: '**** **** **** 2424 - Shawn Stokes' },
  { value: 'MasterCard', label: '**** **** **** 4545 - Cole Armstrong' },
];

export default function CheckoutPayment() {
  const checkout = useCheckoutContext();

  const PaymentSchema = Yup.object().shape({
    payment: Yup.string().required('Payment is required'),
  });

  const defaultValues = {
    delivery: checkout.shipping,
    payment: '',
  };

  const methods = useForm({
    resolver: yupResolver(PaymentSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      checkout.onNextStep();
      checkout.onReset();
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <CheckoutDelivery onApplyShipping={checkout.onApplyShipping} options={DELIVERY_OPTIONS} />

          <CheckoutPaymentMethods
            cardOptions={CARDS_OPTIONS}
            options={PAYMENT_OPTIONS}
            sx={{ my: 3 }}
          />

          <Button
            size="small"
            color="inherit"
            onClick={checkout.onBackStep}
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
          >
            Back
          </Button>
        </Grid>

        <Grid xs={12} md={4}>
          <CheckoutBillingInfo billing={checkout.billing} onBackStep={checkout.onBackStep} />

          <CheckoutSummary
            total={checkout.total}
            subTotal={checkout.subTotal}
            discount={checkout.discount}
            shipping={checkout.shipping}
            onEdit={() => checkout.onGotoStep(0)}
          />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Complete Order
          </LoadingButton>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
