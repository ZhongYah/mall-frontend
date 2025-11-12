import { Card, CardContent, Typography, Avatar, Box, Button } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // i18n

export default function UserInfoPage() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const roleLabel =
    user.username === 'admin1'
      ? t('system_admin')      // 系統管理員 / System Admin
      : t('regular_user');     // 一般使用者 / Regular User

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh',
      }}
    >
      <Card sx={{ maxWidth: 300, p: 3, boxShadow: 3, borderRadius: 3 }}>
        <CardContent sx={{ textAlign: 'center' }}>
          <Avatar
            sx={{
              width: 150,
              height: 150,
              margin: '0 auto 16px',
              bgcolor: 'primary.main',
              fontSize: 32,
            }}
          >
            {user.username}
          </Avatar>

          <Typography variant="body2" sx={{ mt: 1 }}>
            {t('role')}: {roleLabel}
          </Typography>

          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => navigate('/products')}
              sx={{ mb: 1 }}
            >
              {t('back_to_products')}
            </Button>
            <Button
              variant="outlined"
              color="error"
              fullWidth
              onClick={logout}
            >
              {t('logout')}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
