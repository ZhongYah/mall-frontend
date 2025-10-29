import { Card, CardMedia, CardContent, Typography, Button, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ name, price, image, style, onAddToCart }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);

  const handleAdd = () => {
    if (!user) {
      setOpenDialog(true); // 開啟提示 Dialog
      return;
    }
    if (!open) {
      onAddToCart();
      setOpen(true);
    }
  };

  const handleGoLogin = () => {
    setOpenDialog(false);
    navigate('/login'); // 導向登入頁
  };

  return (
    <>
      <Card>
        <CardMedia component="img" height="140" image={image} style={style} alt={name} />
        <CardContent>
          <Typography variant="h6">{name}</Typography>
          <Typography>{t('price')}: ${price}</Typography>
          <Button
            variant="contained"
            sx={{
              mt: 1,
              backgroundColor: '#147e2fff',
              color: '#ffffffff',
              transition: 'transform 0.1s',
              '&:active': {
                transform: 'scale(0.95)',
              },
            }} onClick={handleAdd}  >
            {t('add_to_cart')}
          </Button>
        </CardContent>
      </Card>

      {/* Snackbar 提示 */}
      <Snackbar
        open={open}
        autoHideDuration={800}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setOpen(false)} severity="success" sx={{ width: '100%' }}>
          {t('added_to_cart', { name })}
        </Alert>
      </Snackbar>

      {/* 未登入提示 Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{t('notice')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('please_login_to_add_to_cart')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>{t('cartPage.cancel')}</Button>
          <Button onClick={handleGoLogin} color="primary">
            {t('go_to_login')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
