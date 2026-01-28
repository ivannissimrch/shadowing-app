'use client';

import { useState, useTransition } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';
import { FiGlobe, FiCheck } from 'react-icons/fi';

const languages = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
] as const;

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const currentLanguage = languages.find((lang) => lang.code === locale);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (newLocale: string) => {
    handleClose();
    startTransition(() => {
      router.replace(pathname, { locale: newLocale as 'en' | 'ko' });
    });
  };

  return (
    <>
      <Tooltip title={`Language: ${currentLanguage?.label}`}>
        <IconButton
          onClick={handleClick}
          color="inherit"
          aria-label="change language"
          disabled={isPending}
          sx={{
            color: 'text.primary',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'scale(1.1)',
              backgroundColor: 'grey.100',
            },
          }}
        >
          {isPending ? <CircularProgress size={20} /> : <FiGlobe size={20} />}
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: '8px',
              minWidth: 160,
              mt: 1,
            },
          },
        }}
      >
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            selected={lang.code === locale}
            sx={{
              borderRadius: '8px',
              mx: 1,
              my: 0.5,
              '&.Mui-selected': {
                backgroundColor: 'primary.light',
                '&:hover': {
                  backgroundColor: 'primary.light',
                },
              },
            }}
          >
            <ListItemIcon sx={{ fontSize: '1.25rem', minWidth: 36 }}>
              {lang.flag}
            </ListItemIcon>
            <ListItemText primary={lang.label} />
            {lang.code === locale && (
              <FiCheck size={16} style={{ marginLeft: 8, color: '#1976d2' }} />
            )}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
