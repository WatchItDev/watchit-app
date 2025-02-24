import React from 'react'
import { useSelector } from 'react-redux'
import { LoadingScreen } from '@src/components/loading-screen'
import ShouldLogin from '@src/components/should-login/should-login'

const withAuth = (WrappedComponent: React.ComponentType, icon: string, subtitle: string) => {
  return (props: any) => {
    const sessionData = useSelector((state: any) => state.auth.session)
    const loading = useSelector((state: any) => state.auth.isSessionLoading)

    if (loading) {
      return <LoadingScreen />
    }

    if (!sessionData?.authenticated) {
      return <ShouldLogin icon={icon} subtitle={subtitle} />
    }

    return <WrappedComponent {...props} />
  }
}

export default withAuth
