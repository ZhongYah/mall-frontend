import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

export default function Home() {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Welcome to MallFrontend</Typography>
      <Typography>Explore our products and enjoy shopping!</Typography>
    </Container>
  );
}
