'use client';

import { usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
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
import Image from 'next/image';
import { MenuGroup } from './menuItems';

export const DRAWER_WIDTH = 260;
export const MINI_DRAWER_WIDTH = 72;

interface SidebarProps {
  menuItems: MenuGroup[];
  open: boolean;
  onClose: () => void;
  variant: 'permanent' | 'temporary';
  mini?: boolean;
  onExpand?: () => void;
}

// Translation keys for menu items
const menuTranslationKeys: Record<string, string> = {
  'dashboard': 'navigation.dashboard',
  'students': 'navigation.students',
  'lessons': 'student.myLessons',
  'lists': 'navigation.lists',
  'reviews': 'navigation.reviews',
  'practice': 'navigation.practice',
  'change-password': 'auth.changePassword',
  'main': 'navigation.home',
  'settings': 'navigation.settings',
};

export default function Sidebar({ menuItems, open, onClose, variant, mini = false, onExpand }: SidebarProps) {
  const drawerWidth = mini ? MINI_DRAWER_WIDTH : DRAWER_WIDTH;
  const pathname = usePathname();
  const tNav = useTranslations('navigation');
  const tAuth = useTranslations('auth');
  const tStudent = useTranslations('student');
  const [loadingUrl, setLoadingUrl] = useState<string | null>(null);

  // Helper to get translated text
  const getTranslation = (id: string, fallback: string) => {
    const key = menuTranslationKeys[id];
    if (!key) return fallback;
    if (key.startsWith('navigation.')) return tNav(key.replace('navigation.', ''));
    if (key.startsWith('auth.')) return tAuth(key.replace('auth.', ''));
    if (key.startsWith('student.')) return tStudent(key.replace('student.', ''));
    return fallback;
  };

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
      <Box
        onClick={mini && onExpand ? onExpand : undefined}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
          cursor: mini ? 'pointer' : 'default',
        }}
      >
        {mini ? (
          <Image
            src="/favicon.png"
            alt="ShadowSpeak"
            width={40}
            height={40}
            style={{ objectFit: 'contain' }}
          />
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Image
              src="/favicon.png"
              alt="ShadowSpeak"
              width={40}
              height={40}
              style={{ objectFit: 'contain' }}
            />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', lineHeight: 1.2 }}>
                ShadowSpeak |
              </Typography>
              <Typography variant="caption" sx={{ color: 'primary.main' }}>
                Lynnex English
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Box sx={{ flex: 1, px: mini ? 1 : 2 }}>
        {menuItems.map((group, groupIndex) => (
          <Box key={group.id} sx={{ mb: 2 }}>
            {!mini && (
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
                {getTranslation(group.id, group.title)}
              </Typography>
            )}

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
                      justifyContent: mini ? 'center' : 'flex-start',
                      px: mini ? 1.5 : 2,
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
                        minWidth: mini ? 'auto' : 40,
                        mr: mini ? 0 : 1,
                        color: isActive || isLoading ? 'primary.main' : 'text.secondary',
                      }}
                    >
                      {isLoading ? (
                        <CircularProgress size={20} color="primary" />
                      ) : (
                        <Icon size={20} />
                      )}
                    </ListItemIcon>
                    {!mini && (
                      <ListItemText
                        primary={getTranslation(item.id, item.title)}
                        primaryTypographyProps={{
                          variant: 'body1',
                          fontWeight: isActive || isLoading ? 600 : 400,
                        }}
                      />
                    )}
                  </ListItemButton>
                );
              })}
            </List>

            {!mini && groupIndex < menuItems.length - 1 && (
              <Divider sx={{ mt: 2 }} />
            )}
          </Box>
        ))}
      </Box>

      {!mini && (
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
            ShadowSpeak | Lynnex English v1.0
          </Typography>
        </Box>
      )}
    </Box>
  );

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
          transition: (theme) =>
            theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          overflowX: 'hidden',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}
