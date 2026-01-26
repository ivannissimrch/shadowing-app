'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import { MenuGroup } from './menuItems';

// Drawer width constant
export const DRAWER_WIDTH = 260;

interface SidebarProps {
  menuItems: MenuGroup[];
  open: boolean;
  onClose: () => void;
  variant: 'permanent' | 'temporary';
}

export default function Sidebar({ menuItems, open, onClose, variant }: SidebarProps) {
  const pathname = usePathname();
  const [loadingUrl, setLoadingUrl] = useState<string | null>(null);

  // Clear loading state when pathname changes (navigation complete)
  useEffect(() => {
    setLoadingUrl(null);
  }, [pathname]);

  const handleNavClick = (url: string) => {
    if (url !== pathname) {
      setLoadingUrl(url);
    }
    if (variant === 'temporary') {
      onClose();
    }
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo Section */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 3,
          pb: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: 'primary.main',
            letterSpacing: '-0.5px',
          }}
        >
          ShadowSpeak
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, px: 2 }}>
        {menuItems.map((group, groupIndex) => (
          <Box key={group.id} sx={{ mb: 2 }}>
            {/* Group Title */}
            <Typography
              variant="caption"
              sx={{
                px: 2,
                py: 1,
                display: 'block',
                color: 'text.secondary',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {group.title}
            </Typography>

            {/* Menu Items */}
            <List disablePadding>
              {group.items.map((item) => {
                const isActive = pathname === item.url;
                const isLoading = loadingUrl === item.url;
                const Icon = item.icon;

                return (
                  <ListItemButton
                    key={item.id}
                    component={Link}
                    href={item.url}
                    onClick={() => handleNavClick(item.url)}
                    selected={isActive || isLoading}
                    sx={{
                      borderRadius: 2,
                      mb: 0.5,
                      '&.Mui-selected': {
                        backgroundColor: 'primary.light',
                        color: 'primary.main',
                        '&:hover': {
                          backgroundColor: 'primary.light',
                        },
                        '& .MuiListItemIcon-root': {
                          color: 'primary.main',
                        },
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 40,
                        color: isActive || isLoading ? 'primary.main' : 'text.secondary',
                      }}
                    >
                      {isLoading ? (
                        <CircularProgress size={20} color="primary" />
                      ) : (
                        <Icon size={20} />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.title}
                      primaryTypographyProps={{
                        variant: 'body1',
                        fontWeight: isActive || isLoading ? 600 : 400,
                      }}
                    />
                  </ListItemButton>
                );
              })}
            </List>

            {/* Divider between groups (except last) */}
            {groupIndex < menuItems.length - 1 && (
              <Divider sx={{ mt: 2 }} />
            )}
          </Box>
        ))}
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, pt: 0 }}>
        <Divider sx={{ mb: 2 }} />
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            display: 'block',
            textAlign: 'center',
          }}
        >
          ShadowSpeak v1.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          borderRight: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}
