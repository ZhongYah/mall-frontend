import { Box, Typography, List, ListItem, FormControl, Select, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function Sidebar({ categories, selectedCategory, setCategory, priceOrder, setPriceOrder }) {
  const { t } = useTranslation();

  // 動態生成 categoryMap
  const categoryMap = categories.map((cat) => {
    // 將字串轉成 i18n key
    const keyMap = {
      '所有類別': 'category_all',
      'Home & Living': 'category_home_living',
      'Food & Drink': 'category_food_drink',
      'Furniture': 'category_furniture',
      'Stationery': 'category_stationery',
      'Electronics': 'category_electronics',
    };
    return { key: cat, label: t(keyMap[cat] || cat) };
  });

  const handlePriceOrderChange = (event) => {
    setPriceOrder(event.target.value);
  };

  return (
    <Box sx={{ width: 200, mr: 4 }}>
      <Typography variant="h6">{t('category')}</Typography>
      <List>
        {categoryMap.map((cat) => {
          const isSelected = cat.key === selectedCategory;
          return (
            <ListItem
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              sx={{
                cursor: 'pointer',
                borderRadius: 1,
                mb: 0.5,
                transition: 'all 0.2s',
                backgroundColor: isSelected ? '#016884ff' : 'transparent',
                color: isSelected ? '#ffffff' : 'inherit',
                '&:hover': {
                  backgroundColor: isSelected ? '#016884ff' : 'rgba(20, 126, 255, 0.1)',
                },
              }}
            >
              {cat.label}
            </ListItem>
          );
        })}
      </List>

      <Typography variant="h6" sx={{ mt: 4 }}>
        {t('price_order')}
      </Typography>
      <FormControl fullWidth size="small">
        <Select value={priceOrder} onChange={handlePriceOrderChange} displayEmpty>
          <MenuItem value=""><em>{t('default_sort')}</em></MenuItem>
          <MenuItem value="asc"><em>{t('low_to_high')}</em></MenuItem>
          <MenuItem value="desc"><em>{t('high_to_low')}</em></MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}