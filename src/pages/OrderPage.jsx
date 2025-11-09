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
  Backdrop,
  CircularProgress,
} from '@mui/material';
import { useEffect, useState } from 'react';
import * as orderApi from '../api/order';
import { useTranslation } from 'react-i18next';

export default function OrderPage() {
  const [orders, setOrders] = useState([]);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const username = user?.username;

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        let res;
        if (username === 'admin1') {
          // admin
          res = await orderApi.getAllOrders(); 
        } else {
          // user
          res = await orderApi.getOrders();
        }
        setOrders(res.data);
      } catch (err) {
        console.error('載入訂單失敗:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [username]);

  return (
    <Container sx={{ mt: 4, position: 'relative' }}>
      {/* loading 遮罩 */}
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Typography variant="h4" gutterBottom>
        {t('orderPage.title', '訂單紀錄')}
      </Typography>

      {orders.length === 0 && !loading ? (
        <Typography>{t('orderPage.empty', '目前沒有任何訂單')}</Typography>
      ) : (
        [...orders].reverse().map((order) => (
          <Paper key={order.orderId} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6">
              {t('orderPage.orderId', '訂單編號')}: {order.orderId}
            </Typography>
            <Typography>
              {t('orderPage.total', '總金額')}: ${order.total}
            </Typography>
            <Typography sx={{ mb: 1 }}>
              {t('orderPage.username', '使用者')}: {order.username}
            </Typography>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('orderPage.productName', '商品名稱')}</TableCell>
                    <TableCell>{t('orderPage.quantity', '數量')}</TableCell>
                    <TableCell>{t('orderPage.price', '單價')}</TableCell>
                    <TableCell>{t('orderPage.subtotal', '小計')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>${item.price}</TableCell>
                      <TableCell>${item.subtotal}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        ))
      )}
    </Container>
  );
}
