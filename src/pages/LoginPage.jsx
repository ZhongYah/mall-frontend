import { useState } from 'react';
import { Button, TextField, Container, Typography, CircularProgress, InputAdornment, IconButton, Box } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LoginError } from '../components'
import Logo from '../assets/Logo.png';

export default function LoginPage() {
  const { t } = useTranslation();
  const { loginFn } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isClicking, setIsClicking] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleToggle = () => setShowPassword(!showPassword);

  const handleSubmit = async () => {
    if (loading) return;

    setIsClicking(true);
    setTimeout(() => setIsClicking(false), 150);

    // === 基本檢核，只在按提交時檢查 ===
    if (!username.trim()) {
      setError(t('account_required'));
      return;
    }
    if (!password) {
      setError(t('password_required'));
      return;
    }
    if (password.length < 6) {
      setError(t('password_min_length', { min: 6 }));
      return;
    }

    setError('');
    setLoading(true);

    try {
      await loginFn(username, password);
      setTimeout(() => navigate('/products'), 200);
    } catch (err) {
      console.error(err);

      // === 根據狀態碼對應 i18n 訊息 ===
      if (err.response) {
        // axios response error
        const status = err.response.status;
        if (status === 400) setError(t('login_error_400'));
        else if (status === 500) setError(t('login_error_500'));
        else setError(t('login_failed'));
      } else if (err.message === 'Network Error') {
        setError(t('network_error'));
      } else {
        setError(err.message || t('login_failed'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box component="img" src={Logo} alt="Logo" sx={{ height: 40, mr: 1 }} />
        <Typography
          variant="h5"
          sx={{
            background: 'linear-gradient(90deg, #0073ffff, #8550ffff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
          {t('stone_crab_shop')}
        </Typography>
      </Box>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <TextField
          label={t('account')}
          fullWidth
          margin="normal"
          value={username}
          onChange={e => setUsername(e.target.value)}
          autoComplete="off"
        />
        {/* <TextField
          label={t('password')}
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="new-password"
        /> */}
        <TextField
          label={t('password')}
          type={showPassword ? 'text' : 'password'}
          fullWidth
          margin="normal"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="new-password"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleToggle}
                  edge="end"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )} */}

        <LoginError error={error} />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{
            mt: 2,
            backgroundColor: '#a70202ff',
            color: '#ffffffff',
            transform: isClicking ? 'scale(0.95)' : 'scale(1)',
            transition: 'transform 0.15s ease-out',
            position: 'relative',
          }}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: 'white' }} />
          ) : (
            t('login')
          )}
        </Button>
      </form>
    </Container>
  );
}