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
} from '@mui/material';
import { useEffect, useState } from 'react';
import * as orderApi from '../api/order';
import { useTranslation } from 'react-i18next';

export default function OrderPage() {
  const [orders, setOrders] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    (async () => {
      try {
        const res = await orderApi.getOrders();
        setOrders(res.data);
      } catch (err) {
        console.error('載入訂單失敗:', err);
      }
    })();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('orderPage.title', '訂單紀錄')}
      </Typography>

      {orders.length === 0 ? (
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
