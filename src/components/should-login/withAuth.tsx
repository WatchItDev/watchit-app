import { FC } from "react";
import ShouldLogin from "@src/components/should-login/should-login";
import { LoadingScreen } from "@src/components/loading-screen";
import { WithAuthProps } from "@src/components/should-login/types.ts";
import { useAuth } from "@src/hooks/use-auth.ts";

const withAuth = ({ component: WrappedComponent, header, icon, description }: WithAuthProps) => {
  return () => {
    const { session: sessionData, isSessionLoading: loading } = useAuth();

    if (loading) {
      return <LoadingScreen />;
    }

    if (!sessionData?.authenticated) {
      return <ShouldLogin icon={icon} description={description} title={header} />;
    }

    return <WrappedComponent />;
  };
};

export const WithAuth: FC<WithAuthProps> = ({
  component: Component,
  header,
  icon,
  description,
}) => {
  const AuthComponent = withAuth({ component: Component, header, icon, description });
  return <AuthComponent />;
};
