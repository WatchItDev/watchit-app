// @mui
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
// routes
import { paths } from 'src/routes/paths';
// components
import Iconify from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
import EmptyContent from 'src/components/empty-content';
//
import { useCheckoutContext } from './context';
import CheckoutSummary from './checkout-summary';
import CheckoutCartProductList from './checkout-cart-product-list';

// ----------------------------------------------------------------------

export default function CheckoutCart() {
  const checkout = useCheckoutContext();

  const empty = !checkout.items.length;

  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={8}>
        <Card sx={{ mb: 3 }}>
          <CardHeader
            title={
              <Typography variant="h6">
                Cart
                <Typography component="span" sx={{ color: 'text.secondary' }}>
                  &nbsp;({checkout.totalItems} item)
                </Typography>
              </Typography>
            }
            sx={{ mb: 3 }}
          />

          {empty ? (
            <EmptyContent
              title="Cart is Empty!"
              description="Look like you have no items in your shopping cart."
              imgUrl="/assets/icons/empty/ic_cart.svg"
              sx={{ pt: 5, pb: 10 }}
            />
          ) : (
            <CheckoutCartProductList
              products={checkout.items}
              onDelete={checkout.onDeleteCart}
              onIncreaseQuantity={checkout.onIncreaseQuantity}
              onDecreaseQuantity={checkout.onDecreaseQuantity}
            />
          )}
        </Card>

        <Button
          component={RouterLink}
          href={paths.movie.root}
          color="inherit"
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
        >
          Continue Shopping
        </Button>
      </Grid>

      <Grid xs={12} md={4}>
        <CheckoutSummary
          total={checkout.total}
          discount={checkout.discount}
          subTotal={checkout.subTotal}
          onApplyDiscount={checkout.onApplyDiscount}
        />

        <Button
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          disabled={empty}
          onClick={checkout.onNextStep}
        >
          Check Out
        </Button>
      </Grid>
    </Grid>
  );
}
