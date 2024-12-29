import Stack from "@mui/material/Stack";
import TextMaxLine from "@src/components/text-max-line";
import {formatBalanceNumber} from "@src/utils/format-number.ts";
import Divider from "@mui/material/Divider";
import {InputAmount} from "@src/components/input-amount.tsx";
import {BoxRow} from "@src/sections/finance/components/finance-deposit-from-metamask.tsx";
import {useSelector} from "react-redux";

const FinanceDepositFromSmartAccount = () => {
  const smartWalletBalance = useSelector((state: any) => state.auth.balance);


  return (
    <Stack sx={{my:2, p: 2, gap:1 }}
           direction={'column'}
           display={'flex'}
           alignItems={'center'}
           justifyContent={'space-between'}
    >
      <BoxRow>
        <TextMaxLine line={1}>Balance</TextMaxLine>
        <TextMaxLine line={1} sx={{fontWeight: 'bold',fontSize: '1.5em',color: 'text.secondary'}}>{formatBalanceNumber(smartWalletBalance as any)} MMC</TextMaxLine>
      </BoxRow>

      <Divider  sx={{width: '100%'}}/>

      <BoxRow>
        <TextMaxLine line={1}>Enter the amount to deposit</TextMaxLine>
        <InputAmount max={smartWalletBalance} amount={0} />
      </BoxRow>
    </Stack>
  );
}

export default FinanceDepositFromSmartAccount;
