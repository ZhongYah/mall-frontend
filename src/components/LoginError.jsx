import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

export default function LoginError({ error }) {
    const { t } = useTranslation();

    const [open, setOpen] = useState(Boolean(error));

    useEffect(() => {
        setOpen(Boolean(error));
    }, [error]);

    const handleClose = () => setOpen(false);

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth // 讓 Dialog 寬度拉滿
            maxWidth="sm"
        >
            <DialogTitle>{t('login_failed')}</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ fontSize: '1.1rem' }}> {/* 調整文字大小 */}
                    {error}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary" variant="contained">
                    {t('close')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}