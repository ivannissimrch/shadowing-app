'use client';

import { IconButton, Tooltip } from '@mui/material';
import { useTheme } from '../../../contexts/ThemeContext';

export default function DarkModeToggle() {
  const { mode, toggleMode } = useTheme();

  return (
    <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
      <IconButton
        onClick={toggleMode}
        color="inherit"
        aria-label="toggle theme"
        sx={{
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.1)',
          },
        }}
      >
        {mode === 'light' ? '🌙' : '☀️'}
      </IconButton>
    </Tooltip>
  );
}