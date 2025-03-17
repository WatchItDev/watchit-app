import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import OwnershipTable from '@src/sections/ownership/components/ownership-table.tsx';
import {OwnershipCreate} from "@src/sections/ownership/components/ownership-create.tsx"
import { AssetPolicy, AssetStatus, OwnershipAsset } from '../types';
import {CustomRandom} from "@src/utils/random.ts"

const assetPolicies: AssetPolicy[] = [
  { name: 'Subscription' },
]

const assetStatuses: AssetStatus[] = [
  { name: 'Active' },
  { name: 'Deactivated' },
]

const movies = [
  {movie: 'Matrix Underground', image: 'https://i.blogs.es/8b8798/06-06-matrix/1366_2000.jpg'},
  {movie: 'Titanic II', image: 'https://resizing.flixster.com/jt582j6FBD6irE_K_rGPlcSrii4=/206x305/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p8175397_p_v10_ab.jpg'},
  {movie: 'Gladiator IV', image: 'https://media.sitioandino.com.ar/p/e9e4d7e62c53b7ba3b3cd6b85233a3c5/adjuntos/335/imagenes/000/737/0000737580/1200x630/smart/gladiadorpng.png'},
  {movie: 'El Chavo and Spiderman', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5A7xUMmL75NohLvMjgv9m0o6Ugqt_OQPk5w&s'},
]

const generateRandomAsset = (count: number): OwnershipAsset[] => {
  const assets: OwnershipAsset[] = [];
  for (let i = 0; i < count; i++) {
    const randomPolicy = assetPolicies[Math.floor(CustomRandom.get() * assetPolicies.length)];
    const randomStatus = assetStatuses[Math.floor(CustomRandom.get() * assetStatuses.length)];
    const randomName = movies[Math.floor(CustomRandom.get() * movies.length)];

    const asset: OwnershipAsset = {
      id: i + 1,
      name: randomName.movie,
      image: randomName.image,
      description: `Description for ${randomName.movie}`,
      police: randomPolicy,
      restrictions: CustomRandom.get() < 0.5,
      status: randomStatus
    };

    assets.push(asset);
  }
  return assets;
}

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
          assets={generateRandomAsset(5)}
          loading={false}
        />
      </Grid>
    </Container>
  );
};

export {OwnershipView}
