import { Helmet } from 'react-helmet-async';
// sections
import { UserProfileView } from '@src/sections/user/view';
import { useParams } from '@src/routes/hooks';

// ----------------------------------------------------------------------

export default function UserProfilePage() {
  const params = useParams();
  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: User Profile | {id}</title>
        {/*OG*/}
        <meta property="og:title" content={`Watchit | ${id}`} />
        <meta
          property="og:description"
          content="Visit my profile in Watchit | Discover stories, art, and experiences like never before, connecting you with creators in a decentralized, space built just for you."
        />
        <meta property="og:image" content={`https://app.watchit.movie/default.jpg`} />
        <meta property="og:url" content={`https://app.watchit.movie/${id}`} />
        {/*Twitter*/}
        <meta name="twitter:title" content={`Watchit: A New Era of Video Content with Web3 x AI | ${id}`} />
        <meta
          name="twitter:description"
          content="Visit my profile in Watchit | Discover stories, art, and experiences like never before, connecting you with creators in a decentralized, space built just for you."
        />
        <meta name="twitter:image" content={`https://app.watchit.movie/default.jpg`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@app_watchit" />
      </Helmet>

      <UserProfileView id={id} />
    </>
  );
}
