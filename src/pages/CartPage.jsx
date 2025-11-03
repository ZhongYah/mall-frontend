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

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, totalAmount, clearCart } = useCart();
  const { t } = useTranslation();
  const [selectAll, setSelectAll] = useState(false);

  // const [openDialog, setOpenDialog] = useState(false);
  const [openCheckoutDialog, setOpenCheckoutDialog] = useState(false);

  // 新增成功訊息 state
  const [successMessage, setSuccessMessage] = useState('');

  // 結帳流程
  const handleCheckoutClick = () => {
    if (cart.length === 0) {
      return;
    }
    setOpenCheckoutDialog(true); // 開啟確認結帳 Dialog
  };

  const handleConfirmCheckout = () => {
    if (cart.length === 0) return;

    const total = totalAmount;

    // 顯示成功訊息
    setSuccessMessage(t('cartPage.checkoutSuccess', { total }));

    // 清空購物車
    clearCart();
    setSelectAll(false);

    setOpenCheckoutDialog(false);
  };

  // 清空購物車 Dialog
  const handleDeleteAllClick = () => {
    // setOpenDialog(true);
    clearCart();
    setSelectAll(false);
  };

  const getDisplayName = (name) => {
    const lang = localStorage.getItem('i18nextLng')
    if (lang === 'zh') {
      const parts = name.split(' ');
      return parts[0]; // 空格前
    } else if (lang === 'en') {
      const parts = name.split(' ');
      return parts.slice(1).join(' '); // 空格後
    }
    return name; // fallback
  };

  // 當組件 unmount 時清除成功訊息
  useEffect(() => {
    return () => setSuccessMessage('');
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('cartPage.title')}
      </Typography>

      {/* 成功訊息 */}
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
                    <TableCell>${item.price}</TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        size="small"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, Math.max(1, Number(e.target.value)))}
                        sx={{ width: 60 }}
                      />
                    </TableCell>
                    <TableCell>${item.price * item.quantity}</TableCell>
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
            {t('cartPage.total')}: ${totalAmount}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2, backgroundColor: '#147e2fff', color: '#ffffffff' }}
            onClick={handleCheckoutClick}
          >
            {t('cartPage.checkout')}
          </Button>

          {/* 確認結帳 Dialog */}
          <Dialog open={openCheckoutDialog} onClose={() => setOpenCheckoutDialog(false)}>
            <DialogTitle>{t('cartPage.checkoutTitle')}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                {t('cartPage.checkoutConfirm', { total: totalAmount })}
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