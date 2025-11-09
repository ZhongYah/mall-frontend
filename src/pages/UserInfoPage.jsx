import { Card, CardContent, Typography, Avatar, Box, Button } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function UserInfoPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

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

          {/* <Typography variant="h5" gutterBottom>
            {user.username}
          </Typography> */}
          {/* <Typography variant="body1" color="text.secondary">
            {user.email || '未設定 Email'}
          </Typography> */}
          <Typography variant="body2" sx={{ mt: 1 }}>
            角色：{user.username === 'admin1' ? '系統管理員' : '一般使用者'}
          </Typography>

          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => navigate('/products')}
              sx={{ mb: 1 }}
            >
              返回商品頁
            </Button>
            <Button
              variant="outlined"
              color="error"
              fullWidth
              onClick={logout}
            >
              登出
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
