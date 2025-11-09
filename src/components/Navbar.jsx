import { AppBar, Toolbar, Button, Typography, MenuItem, Select, Box, IconButton, Tooltip, Avatar } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import React from 'react';
import Logo from '../assets/Logo.png';


export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [lang, setLang] = React.useState(i18n.language || 'zh');
  const user1 = JSON.parse(localStorage.getItem('user'));
  const username = user1?.username || 'Guest';

  const handleLanguageChange = (event) => {
    const newLang = event.target.value;
    i18n.changeLanguage(newLang);
    setLang(newLang);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#016884ff', color: '#ffffffff' }} elevation={0}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* 左側：Logo + 網站名稱 + 商品按鈕 */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* 左側：Logo + 網站名稱 */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              userSelect: 'none',
              borderRadius: 1,
              transition: 'transform 0.1s, background-color 0.1s',
              px: 1,
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
              '&:active': { transform: 'scale(0.95)', backgroundColor: 'rgba(255,255,255,0.2)' },
            }}
            onClick={() => navigate('/products')}
          >
            <Box component="img" src={Logo} alt="Logo" sx={{ height: 40, mr: 1 }} />
            <Typography variant="h6" sx={{ mr: 2 }}>
              {t('stone_crab_shop')}
            </Typography>
          </Box>

          {/* Products 按鈕 */}
          <Button
            color="inherit"
            sx={{
              backgroundColor: '#ba3d3dff',
              color: '#ffffffff',
              textTransform: 'none',
              ml: 1, // 左間距
              '&:hover': { backgroundColor: '#432424ff' },
            }}
            onClick={() => navigate('/products')}
          >
            {t('products')}
          </Button>

          {/* Home 按鈕 */}
          <Button
            color="inherit"
            sx={{
              textTransform: 'none',
              ml: 6,
              fontSize: 16,
              background: 'linear-gradient(90deg, #ffffffff, #f9ffdbff, #ffffffff)',
              fontFamily: '"Poppins", "Microsoft JhengHei", sans-serif',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'shine 3s linear infinite, pulse 3s ease-in-out infinite',
              '@keyframes shine': {
                '0%': { backgroundPosition: '200% center' },
                '100%': { backgroundPosition: '-200% center' },
              },
              '@keyframes pulse': {
                '0%, 100%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.05)' },
              },
            }}
            onClick={() => navigate('/home')}
          >
            {t('about')}
          </Button>

        </Box>

        {/* 右側：語言切換 + 登入/登出 */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>

          <Tooltip title={username}>
            <IconButton
              onClick={() => navigate('/userInfo')}
              sx={{ ml: 2 }}
              size="large"
            >
              <Avatar
                sx={{
                  bgcolor: '#1976d2',
                  width: 36,
                  height: 36,
                  fontSize: 16,
                  fontFamily: '"Poppins", "Microsoft JhengHei", sans-serif',
                }}
              >
                {username.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Select
            value={lang}
            onChange={handleLanguageChange}
            sx={{ color: 'white', mr: 2 }}
          >
            <MenuItem value="zh">中文</MenuItem>
            <MenuItem value="en">English</MenuItem>
          </Select>

          {user ? (
            <>
              <Button color="inherit" onClick={() => navigate('/cart')}>{t('cart')}</Button>
              <Button color="inherit" onClick={() => navigate('/orders')}>{t('orders')}</Button>
              <Button
                color="inherit"
                onClick={() => {
                  logout();           // 清掉使用者狀態
                  navigate('/login'); // 登出後跳轉
                }}
              >
                {t('logout')}
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate('/login')}>{t('login')}</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
