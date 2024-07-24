import { Helmet } from 'react-helmet-async';
// sections
import AvatarView from 'src/sections/_examples/mui/avatar-view';

// ----------------------------------------------------------------------

export default function AvatarPage() {
  return (
    <>
      <Helmet>
        <title> MUI: Avatar</title>
      </Helmet>

      <AvatarView />
    </>
  );
}
