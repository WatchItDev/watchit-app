import { Helmet } from 'react-helmet-async';
import { useBoolean } from 'src/hooks/use-boolean';

import LoginPage from '../sections/login/loginpage';
import BlankView from '../sections/blank/view';

// ----------------------------------------------------------------------

export default function Login() {

  return (
    <>
      <Helmet>
        <title> Login</title>
      </Helmet>

      <BlankView>
        <LoginPage />
      </BlankView>
    </>
  );
}
