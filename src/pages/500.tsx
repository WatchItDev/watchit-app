import { Helmet } from 'react-helmet-async'
import { View500 } from '@src/sections/error'

export default function Page500() {
  return (
    <>
      <Helmet>
        <title> 500 Internal Server Error</title>
      </Helmet>

      <View500 />
    </>
  )
}
