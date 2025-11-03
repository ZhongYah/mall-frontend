import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import { ProductCard, Sidebar } from '../components';
import { useCart } from '../hooks/useCart';
import { getProducts } from '../api/products';
import { CircularProgress, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const categories = ['所有類別', 'Home & Living', 'Food & Drink', 'Furniture', 'Stationery', 'Electronics'];

export default function ProductListPage() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [selectedCategory, setCategory] = useState('所有類別');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [priceOrder, setPriceOrder] = useState('');
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const pageSize = 3;
  const { addToCart } = useCart();

  const fetchProducts = async (clear) => {
    setLoading(true);
    try {
      const rawParams = {
        keyword: clear ? '' : searchInput?.trim() || undefined,
        category: selectedCategory === '所有類別' ? undefined : selectedCategory,
        sortBy: priceOrder === '' ? '' : 'price',
        sortDir: priceOrder,
        page: page - 1, // 後端 page 從 0 開始
        size: pageSize,
      };

      // 過濾掉 undefined 或空字串的 key
      const params = Object.fromEntries(
        Object.entries(rawParams).filter(([, v]) => v !== undefined && v !== '')
      );

      const response = await getProducts(params);
      setProducts(response.data.content || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      console.error('Fetch products error:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = async () => {
    // 清空搜尋條件
    setSearchInput('');
    await fetchProducts('clear');
  };

  // 一進畫面 & 條件變化時重新抓
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, priceOrder, page]);

  const handleSearchClick = () => {
    setPage(1); // 搜尋後回第一頁
    fetchProducts();
  };

  return (
    <Container sx={{ display: 'flex', mt: 4 }}>
      {/* 側邊欄 */}
      <Sidebar
        categories={categories}
        selectedCategory={selectedCategory}
        setCategory={(cat) => {
          setCategory(cat);
          setPage(1);
        }}
        priceOrder={priceOrder}
        setPriceOrder={(order) => {
          setPriceOrder(order);
          setPage(1);
        }}
      />

      {/* 商品區 */}

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', alignItems: 'center' }}>
          <TextField
            label={t('search_placeholder')}
            variant="outlined"
            fullWidth
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
            sx={{ mt: 1 }}
            InputProps={{
              endAdornment: (
                searchInput && (
                  <IconButton
                    size="small"
                    onClick={() => {
                      handleClearSearch(); // 清除後自動 fetch
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )
              ),
            }}
          />

          <Button
            variant="contained"
            sx={{
              mt: 1,
              backgroundColor: '#016884ff',
              color: '#ffffffff',
              height: 55,
            }}
            size="medium" 
            onClick={handleSearchClick}
          >
            {t('search_button')}
          </Button>
        </div>


        <div style={{ flex: 1, position: 'relative' }}>
          {/* 商品區 */}
          <Grid container spacing={2}>
            {products.length > 0 ? (
              products.map((p) => (
                <Grid item key={p.id} xs={12} sm={6} md={4} sx={{ display: 'flex' }}>
                  <ProductCard
                    name={p.name}
                    price={p.price}
                    image={p.imageUrl}
                    description={p.description}
                    onAddToCart={() => addToCart(p)}
                    sx={{ flex: 1 }}
                  />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                {t('no_products')}
              </Grid>
            )}
          </Grid>

          {/* Overlay loading */}
          {loading && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(255,255,255,0.6)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 10,
              }}
            >
              <CircularProgress />
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}
          />
        )}
      </div>
    </Container>
  );
}