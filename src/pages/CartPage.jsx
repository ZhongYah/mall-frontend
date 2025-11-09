import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useCart } from '../hooks/useCart';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import * as orderApi from '../api/order';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, totalAmount, clearCart } = useCart();
  const { t } = useTranslation();
  const [selectAll, setSelectAll] = useState(false);
  const [openCheckoutDialog, setOpenCheckoutDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleCheckoutClick = () => {
    if (!cart.length) return;
    setOpenCheckoutDialog(true);
  };

  const handleConfirmCheckout = async () => {
    console.log('結帳中，購物車內容:', cart);
    if (!cart.length) return;

    try {
      // 呼叫後端建立訂單 API，將 localStorage cart 串過去
      const res = await orderApi.placeOrderWithCart(cart);

      setSuccessMessage(t('cartPage.checkoutSuccess', { total: res.data.total }));

      // 清空購物車
      clearCart();
      setSelectAll(false);
    } catch (err) {
      console.error('結帳失敗:', err);
    } finally {
      setOpenCheckoutDialog(false);
    }
  };

  const handleDeleteAllClick = () => {
    clearCart();
    setSelectAll(false);
  };

  const getDisplayName = (name) => {
    const lang = localStorage.getItem('i18nextLng');
    if (lang === 'zh') return name.split(' ')[0];
    if (lang === 'en') return name.split(' ').slice(1).join(' ');
    return name;
  };

  useEffect(() => () => setSuccessMessage(''), []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('cartPage.title')}
      </Typography>

      {successMessage && (
        <Typography color="success.main" sx={{ mb: 2 }}>
          {successMessage}
        </Typography>
      )}

      {cart.length === 0 ? (
        <Typography>{t('cartPage.empty')}</Typography>
      ) : (
        <>
          <FormControlLabel
            control={<Checkbox checked={selectAll} onChange={(e) => setSelectAll(e.target.checked)} />}
            label={t('cartPage.selectAll')}
          />
          <Button
            variant="outlined"
            color="error"
            sx={{ ml: 2 }}
            onClick={handleDeleteAllClick}
            disabled={!selectAll}
          >
            {t('cartPage.deleteAll')}
          </Button>

          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('cartPage.productName')}</TableCell>
                  <TableCell>{t('cartPage.price')}</TableCell>
                  <TableCell>{t('cartPage.quantity')}</TableCell>
                  <TableCell>{t('cartPage.subtotal')}</TableCell>
                  <TableCell>{t('cartPage.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cart.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{getDisplayName(item.name)}</TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        size="small"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, Math.max(1, Number(e.target.value)))}
                        sx={{ width: 60 }}
                      />
                    </TableCell>
                    <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => removeFromCart(item.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="h6" sx={{ mt: 2 }}>
            {t('cartPage.total')}: ${totalAmount.toFixed(2)}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2, backgroundColor: '#147e2fff', color: '#fff' }}
            onClick={handleCheckoutClick}
          >
            {t('cartPage.checkout')}
          </Button>

          <Dialog open={openCheckoutDialog} onClose={() => setOpenCheckoutDialog(false)}>
            <DialogTitle>{t('cartPage.checkoutTitle')}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                {t('cartPage.checkoutConfirm', { total: totalAmount.toFixed(2) })}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenCheckoutDialog(false)}>{t('cartPage.cancel')}</Button>
              <Button onClick={handleConfirmCheckout} color="primary">
                {t('cartPage.confirm')}
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Container>
  );
}
