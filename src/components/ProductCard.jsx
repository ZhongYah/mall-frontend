import { Card, CardMedia, CardContent, Typography, Button, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { ProductImage } from '../components'

export default function ProductCard({ name, price, image, description, onAddToCart }) {
  const { t } = useTranslation();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false); // 未登入提示
  const [openDescDialog, setOpenDescDialog] = useState(false); // 商品 description Dialog
  const [closeDescAfterAdd, setCloseDescAfterAdd] = useState(false); // 控制 description Dialog 是否要在加入購物車後關閉

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAdd = () => {
    if (!user) {
      setOpenDialog(true);
      return;
    }
    onAddToCart();
    setSnackbarOpen(true);
    setCloseDescAfterAdd(true); // 標記加入購物車後要關閉 description Dialog
  };

  const handleGoLogin = () => {
    setOpenDialog(false);
    navigate('/login');
  };

  const getDisplayName = (text) => {
    const lang = localStorage.getItem('i18nextLng');
    if (lang === 'zh') return text.split(' ')[0];
    if (lang === 'en') return text.split(' ').slice(1).join(' ');
    return text;
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Card 可點擊整個顯示 description */}
      <Card
        sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 270, maxWidth: 300, minHeight: 460, maxHeight: 480, cursor: 'pointer' }}
        onClick={() => setOpenDescDialog(true)}
      >
        {/* <CardMedia
          component="img"
          image={image}
          alt={getDisplayName(name)}
          sx={{ height: 220, width: '100%', objectFit: 'cover' }}
        /> */}

        <ProductImage image={image} alt={getDisplayName(name)} />

        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
          >
            {getDisplayName(name)}
          </Typography>
          <Typography sx={{ mt: 1 }}>{t('price')}: ${price}</Typography>
          <Button
            variant="contained"
            sx={{ mt: 1, backgroundColor: '#147e2fff', color: '#ffffffff', transition: 'transform 0.1s', '&:active': { transform: 'scale(0.95)' } }}
            onClick={(e) => {
              e.stopPropagation(); // 避免點擊按鈕也觸發 Card onClick
              handleAdd();
            }}
          >
            {t('add_to_cart')}
          </Button>
        </CardContent>
      </Card>

      {/* Snackbar 提示 */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1200}
        onClose={() => {
          setSnackbarOpen(false);
          if (closeDescAfterAdd) {
            setOpenDescDialog(false); // 成功加入購物車後再關閉 description Dialog
            setCloseDescAfterAdd(false);
          }
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {t('added_to_cart', { name })}
        </Alert>
      </Snackbar>

      {/* 未登入提示 Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{t('notice')}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t('please_login_to_add_to_cart')}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>{t('cartPage.cancel')}</Button>
          <Button onClick={handleGoLogin} color="primary">{t('go_to_login')}</Button>
        </DialogActions>
      </Dialog>

      {/* 商品 description Dialog */}
      <Dialog open={openDescDialog} onClose={() => setOpenDescDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{getDisplayName(name)}</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            {/* <img src={image} alt={getDisplayName(name)} style={{ width: '100%' }} /> */}
            <ProductImage image={image} alt={getDisplayName(name)} height={'auto'} />
          </Box>
          <Typography>{getDisplayName(description)}</Typography>
          <Typography sx={{ mt: 2 }}><strong>{t('price')}:</strong> ${price}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDescDialog(false)}>{t('close')}</Button>
          <Button
            variant="contained"
            onClick={(e) => {
              e.stopPropagation();
              handleAdd(); // 觸發加入購物車，但不直接關閉 Dialog
            }}
          >
            {t('add_to_cart')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}