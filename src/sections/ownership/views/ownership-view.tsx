import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import OwnershipTable from '@src/sections/ownership/components/ownership-table.tsx';
import {OwnershipCreate} from "@src/sections/ownership/components/ownership-create.tsx"
import { AssetPolicy, AssetStatus, AssetType, OwnershipAsset } from '../types';


const assetPolicies: AssetPolicy[] = [
  { name: 'Subscription' },
  { name: 'Buy' },
  { name: 'Rent' },
]

const assetStatuses: AssetStatus[] = [
  { name: 'Active' },
  { name: 'Deactivated' },
]

const assetTypes: AssetType[] = [
  { name: 'Short' },
  { name: 'Movie' },
  { name: 'Series' },
  { name: 'Documentary' },
  { name: 'Trailer' }
]

const movies = [
  {movie: 'Matrix Underground', image: 'https://i.blogs.es/8b8798/06-06-matrix/1366_2000.jpg'},
  {movie: 'Titanic II', image: 'https://resizing.flixster.com/jt582j6FBD6irE_K_rGPlcSrii4=/206x305/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p8175397_p_v10_ab.jpg'},
  {movie: 'Gladiator IV', image: 'https://pics.filmaffinity.com/gladiator_ii-808387712-large.jpg'},
  {movie: 'El Chavo and Spiderman', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5A7xUMmL75NohLvMjgv9m0o6Ugqt_OQPk5w&s'},
]

const generateRandomAsset = (count: number): OwnershipAsset[] => {
  const assets: OwnershipAsset[] = [];
  for (let i = 0; i < count; i++) {
    const randomPolicy = assetPolicies[Math.floor(Math.random() * assetPolicies.length)];
    const randomStatus = assetStatuses[Math.floor(Math.random() * assetStatuses.length)];
    const randomType = assetTypes[Math.floor(Math.random() * assetTypes.length)];
    const randomName = movies[Math.floor(Math.random() * movies.length)];

    const asset: OwnershipAsset = {
      id: i + 1,
      name: randomName.movie,
      image: randomName.image,
      description: `Description for ${randomName.movie}`,
      police: randomPolicy,
      restrictions: Math.random() < 0.5,
      status: randomStatus,
      type: randomType,
    };

    assets.push(asset);
  }
  return assets;
}

console.log(generateRandomAsset(1))



const OwnershipView = () => {
  return (
    <Container
      sx={{
        marginTop: { xs: '1rem', md: '2rem' },
        marginBottom: '2rem',
        maxWidth: '100% !important',
      }}
    >
      <Grid container spacing={1} justifyContent={'flex-end'} alignItems="center" gap={1}>
        <OwnershipCreate onSuccess={() =>{}} />
      </Grid>

      <Grid
        container
        spacing={0}
        sx={{
          mt: 1,
        }}
      >
        <OwnershipTable
          assets={generateRandomAsset(50)}
          loading={false}
        />
      </Grid>
    </Container>
  );
};

export {OwnershipView}
