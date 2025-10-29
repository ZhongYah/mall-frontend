import { Box, Typography, List, ListItem, FormControl, Select, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function Sidebar({ selectedCategory, setCategory, priceOrder, setPriceOrder }) {
  const { t } = useTranslation();
  const categoryMap = [
    { key: 'all', labelKey: 'category_all' },
    { key: 'A', labelKey: 'category_A' },
    { key: 'B', labelKey: 'category_B' },
    { key: 'C', labelKey: 'category_C' },
  ];

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
                backgroundColor: isSelected ? '#016884ff' : 'transparent', // 選中才有顏色
                color: isSelected ? '#ffffff' : 'inherit', // 選中文字變白
                '&:hover': {
                  backgroundColor: isSelected ? '#016884ff' : 'rgba(20, 126, 255, 0.1)',
                },
              }}
            >
              {t(cat.labelKey)}
            </ListItem>
          );
        })}
      </List>

      <Typography variant="h6" sx={{ mt: 4 }}>
        {t('price_order')}
      </Typography>
      <FormControl fullWidth size="small">
        <Select value={priceOrder} onChange={handlePriceOrderChange}>
          <MenuItem value="asc">{t('low_to_high')}</MenuItem>
          <MenuItem value="desc">{t('high_to_low')}</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
