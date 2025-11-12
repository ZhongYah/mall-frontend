import { Container, Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();

  return (
    <Container sx={{ mt: 6, textAlign: 'center' }}>
      <Box>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          {t('home.title')}
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 2, color: 'text.secondary' }}>
          {t('home.tagline')}
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: 600, mx: 'auto', mt: 2, lineHeight: 1.8 }}>
          {t('home.description')}
        </Typography>
      </Box>
    </Container>
  );
}