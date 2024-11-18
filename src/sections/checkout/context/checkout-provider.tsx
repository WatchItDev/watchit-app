import uniq from 'lodash/uniq';
import { useEffect, useMemo, useCallback } from 'react';
// hooks
import { useLocalStorage } from '@src/hooks/use-local-storage';
// routes
import { paths } from '@src/routes/paths';
import { useRouter } from '@src/routes/hooks';
// _mock
import { PRODUCT_CHECKOUT_STEPS } from '@src/_mock/_product';
// types
import { IAddressItem } from '@src/types/address';
import { ICheckoutValue, ICheckoutItem } from '@src/types/checkout';
//
import { CheckoutContext } from './checkout-context';

// ----------------------------------------------------------------------

const STORAGE_KEY = 'checkout';

const initialState = {
  activeStep: 0,
  items: [],
  subTotal: 0,
  total: 0,
  discount: 0,
  shipping: 0,
  billing: null,
  totalItems: 0,
};

type Props = {
  children: React.ReactNode;
};

export function CheckoutProvider({ children }: Props) {
  const router = useRouter();

  const [values, setValues] = useLocalStorage(STORAGE_KEY, initialState);

  const setValue = useCallback(
    (name: string, value: number | IAddressItem | ICheckoutItem[]) => {
      setValues((prevState: ICheckoutValue) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [setValues]
  );

  const onGetCart = useCallback(() => {
    const totalItems: number = values.items.reduce(
      (total: number, item: ICheckoutItem) => total + item.quantity,
      0
    );

    const subTotal: number = values.items.reduce(
      (total: number, item: ICheckoutItem) => total + item.quantity * item.price,
      0
    );

    setValue('subTotal', subTotal);
    setValue('totalItems', totalItems);
    setValue('billing', values.activeStep === 1 ? null : values.billing);
    setValue('discount', values.items.length ? values.discount : 0);
    setValue('shipping', values.items.length ? values.shipping : 0);
    setValue('total', values.subTotal - values.discount + values.shipping);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    values.items,
    values.activeStep,
    values.billing,
    values.discount,
    values.shipping,
    values.subTotal,
  ]);

  useEffect(() => {
    onGetCart();
  }, [onGetCart]);

  const onAddToCart = useCallback(
    (newItem: ICheckoutItem) => {
      const updatedItems: ICheckoutItem[] = values.items.map((item: ICheckoutItem) => {
        if (item.id === newItem.id) {
          return {
            ...item,
            colors: uniq([...item.colors, ...newItem.colors]),
            quantity: item.quantity + 1,
          };
        }
        return item;
      });

      if (!updatedItems.some((item: ICheckoutItem) => item.id === newItem.id)) {
        updatedItems.push(newItem);
      }

      setValue('items', updatedItems);
    },
    [setValue, values.items]
  );

  const onDeleteCart = useCallback(
    (itemId: string) => {
      const updatedItems = values.items.filter((item: ICheckoutItem) => item.id !== itemId);

      setValue('items', updatedItems);
    },
    [setValue, values.items]
  );

  const onBackStep = useCallback(() => {
    setValue('activeStep', values.activeStep - 1);
  }, [setValue, values.activeStep]);

  const onNextStep = useCallback(() => {
    setValue('activeStep', values.activeStep + 1);
  }, [setValue, values.activeStep]);

  const onGotoStep = useCallback(
    (step: number) => {
      setValue('activeStep', step);
    },
    [setValue]
  );

  const onIncreaseQuantity = useCallback(
    (itemId: string) => {
      const updatedItems = values.items.map((item: ICheckoutItem) => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }
        return item;
      });

      setValue('items', updatedItems);
    },
    [setValue, values.items]
  );

  const onDecreaseQuantity = useCallback(
    (itemId: string) => {
      const updatedItems = values.items.map((item: ICheckoutItem) => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity: item.quantity - 1,
          };
        }
        return item;
      });

      setValue('items', updatedItems);
    },
    [setValue, values.items]
  );

  const onCreateBilling = useCallback(
    (address: IAddressItem) => {
      setValue('billing', address);

      onNextStep();
    },
    [onNextStep, setValue]
  );

  const onApplyDiscount = useCallback(
    (discount: number) => {
      setValue('discount', discount);
    },
    [setValue]
  );

  const onApplyShipping = useCallback(
    (shipping: number) => {
      setValue('shipping', shipping);
    },
    [setValue]
  );

  const completed = values.activeStep === PRODUCT_CHECKOUT_STEPS.length;

  // Reset
  const onReset = useCallback(() => {
    if (completed) {
      setValues(initialState);
      router.replace(paths.publication.root);
    }
  }, [completed, router, setValues]);

  const memoizedValue = useMemo(
    () => ({
      ...values,
      completed,
      //
      onAddToCart,
      onDeleteCart,
      //
      onIncreaseQuantity,
      onDecreaseQuantity,
      //
      onCreateBilling,
      onApplyDiscount,
      onApplyShipping,
      //
      onBackStep,
      onNextStep,
      onGotoStep,
      //
      onReset,
    }),
    [
      completed,
      onAddToCart,
      onApplyDiscount,
      onApplyShipping,
      onBackStep,
      onCreateBilling,
      onDecreaseQuantity,
      onDeleteCart,
      onGotoStep,
      onIncreaseQuantity,
      onNextStep,
      onReset,
      values,
    ]
  );

  return <CheckoutContext.Provider value={memoizedValue}>{children}</CheckoutContext.Provider>;
}
