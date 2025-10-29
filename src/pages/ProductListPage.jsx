import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import { ProductCard, Sidebar } from '../components';
import { useCart } from '../hooks/useCart';
import ReactLogo from '../assets/react.svg';


// 商品資料
const sampleProducts = Array.from({ length: 30 }).map((_, i) => {
  const id = i + 1;
  let category;
  const firstDigit = id.toString()[0];
  if (firstDigit === '1') category = 'A';
  else if (firstDigit === '2') category = 'B';
  else if (firstDigit === '3') category = 'C';
  else category = null;

  return {
    id,
    name: `products ${id}`,
    category,
    price: id * 10,
    image: ReactLogo,
  };
});

const categories = ['所有類別', 'A', 'B', 'C'];

export default function ProductListPage() {
  const { t } = useTranslation();
  const [selectedCategory, setCategory] = useState('all');
  const [searchInput, setSearchInput] = useState(''); // 使用者輸入
  const [search, setSearch] = useState('');           // 實際搜尋觸發
  const [page, setPage] = useState(1);
  const [priceOrder, setPriceOrder] = useState('asc'); // 預設由低到高

  const pageSize = 6;
  const { addToCart } = useCart();

  // 搜尋按鈕觸發
  const handleSearchClick = () => {
    setSearch(searchInput);
    setPage(1); // 搜尋後回到第一頁
  };

  // 篩選商品：類別 + 搜尋
  let filtered = sampleProducts.filter(
    (p) =>
      (selectedCategory === 'all' || p.category === selectedCategory) &&
      p.name.toLowerCase().includes(search.toLowerCase())
  );

  // 依照價格排序
  filtered.sort((a, b) => {
    if (priceOrder === 'asc') return a.price - b.price;   // 由低到高
    if (priceOrder === 'desc') return b.price - a.price;  // 由高到低
    return 0;
  });

  // 分頁
  const pageCount = Math.ceil(filtered.length / pageSize);
  const paginatedProducts = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <Container sx={{ display: 'flex', mt: 4 }}>
      {/* 側邊欄 */}
      <Sidebar
        categories={categories}
        selectedCategory={selectedCategory}
        setCategory={(cat) => {
          setCategory(cat);
          setSearchInput(''); // 清空搜尋輸入框
          setSearch('');      // 清空實際搜尋條件
          setPage(1); // 選擇類別時回到第一頁
        }}
        priceOrder={priceOrder}
        setPriceOrder={(order) => {
          setPriceOrder(order);
          setPage(1); // 調整價格排序時回到第一頁
        }}
      />

      {/* 商品列表 */}
      <div style={{ flex: 1 }}>
        {/* 搜尋欄 + 按鈕 */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <TextField
            label={t('search_placeholder')}
            variant="outlined"
            fullWidth
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault(); // 防止頁面刷新或表單提交
                handleSearchClick(); // 觸發搜尋
              }
            }}
            sx={{ mt: 1 }}
          />
          <Button variant="contained" sx={{ mt: 1, backgroundColor: '#016884ff', color: '#ffffffff' }} onClick={handleSearchClick}>
            {t('search_button')}
          </Button>
        </div>
        <Grid container spacing={2}>
          {paginatedProducts.length > 0 ? (
            paginatedProducts.map((p) => (
              <Grid item key={p.id} xs={12} sm={6} md={4}>
                <ProductCard
                  name={p.name}
                  price={p.price}
                  image={p.image}
                  style={{ width: 80, height: 80, objectFit: 'contain' }}
                  onAddToCart={() => addToCart(p)}
                />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              {t('no_products')}
            </Grid>
          )}
        </Grid>

        {/* 分頁 */}
        {pageCount > 1 && (
          <Pagination
            count={pageCount}
            page={page}
            onChange={(e, value) => setPage(value)}
            sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}
          />
        )}
      </div>
    </Container>
  );
}
