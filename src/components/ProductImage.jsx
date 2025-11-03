import { CardMedia, Box } from '@mui/material';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';
import { useState } from 'react';

export default function ProductImage({ image, alt, height = 220 }) {
    const [imgError, setImgError] = useState(false);

    return imgError ? (
        <Box
            sx={{
                height: height,
                width: '100%',
                backgroundColor: '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <BrokenImageIcon sx={{ fontSize: 60, color: '#ccc' }} />
        </Box>
    ) : (
        <CardMedia
            component="img"
            image={image}
            alt={alt}
            sx={{ height: height, width: '100%', objectFit: 'cover' }}
            onError={() => setImgError(true)}
        />
    );
}