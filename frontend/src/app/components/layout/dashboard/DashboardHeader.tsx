'use client';

import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import { FiMenu, FiLogOut, FiUser, FiChevronLeft } from 'react-icons/fi';
import Image from 'next/image';
import { useAuthContext } from '../../../AuthContext';
import { DRAWER_WIDTH, MINI_DRAWER_WIDTH } from './Sidebar';
import DarkModeToggle from '../../ui/DarkModeToggle';
import LanguageSwitcher from '../../ui/LanguageSwitcher';

interface DashboardHeaderProps {
  onMenuToggle: () => void;
  sidebarOpen: boolean;
  userType: 'teacher' | 'student';
}

export default function DashboardHeader({
  onMenuToggle,
  sidebarOpen,
  userType,
}: DashboardHeaderProps) {
  const t = useTranslations('auth');
  const tNav = useTranslations('navigation');
  const { updateToken } = useAuthContext();
  const router = useRouter();

  const handleLogout = () => {
    updateToken(null);
    router.push('/');
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        width: { md: `calc(100% - ${sidebarOpen ? DRAWER_WIDTH : MINI_DRAWER_WIDTH}px)` },
        ml: { md: `${sidebarOpen ? DRAWER_WIDTH : MINI_DRAWER_WIDTH}px` },
        transition: (theme) =>
          theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left side - Menu toggle */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Desktop sidebar toggle */}
          <Tooltip title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}>
            <IconButton
              color="inherit"
              aria-label="toggle sidebar"
              onClick={onMenuToggle}
              sx={{
                display: { xs: 'none', md: 'flex' },
                color: 'text.primary',
                transition: 'transform 0.2s',
                transform: sidebarOpen ? 'rotate(0deg)' : 'rotate(180deg)',
              }}
            >
              <FiChevronLeft size={24} />
            </IconButton>
          </Tooltip>

          {/* Mobile menu toggle */}
          <IconButton
            color="inherit"
            aria-label="toggle menu"
            onClick={onMenuToggle}
            sx={{
              display: { xs: 'flex', md: 'none' },
              color: 'text.primary',
            }}
          >
            <FiMenu size={24} />
          </IconButton>

          {/* Mobile logo - only on mobile since sidebar is hidden */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 0.5 }}>
            <Image
              src="/favicon.png"
              alt="ShadowSpeak"
              width={28}
              height={28}
              style={{ objectFit: 'contain' }}
            />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main', lineHeight: 1.1 }}>
                ShadowSpeak
              </Typography>
              <Typography variant="caption" sx={{ color: 'primary.main', lineHeight: 1.1 }}>
                Lynnex English
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Center - Page title or breadcrumb (optional) */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              textTransform: 'capitalize',
            }}
          >
            {userType === 'teacher' ? tNav('students') : tNav('lessons')} - {tNav('dashboard')}
          </Typography>
        </Box>

        {/* Right side - Dark mode, User profile and logout */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Language switcher */}
          <LanguageSwitcher />

          {/* Dark mode toggle */}
          <DarkModeToggle />

          {/* User avatar/info */}
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              gap: 1,
              mr: 1,
            }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: userType === 'teacher' ? 'secondary.main' : 'primary.main',
                fontSize: '0.875rem',
              }}
            >
              <FiUser size={18} />
            </Avatar>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', textTransform: 'capitalize' }}
              >
                {userType}
              </Typography>
            </Box>
          </Box>

          {/* Logout button */}
          <Tooltip title={t('logout')}>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={handleLogout}
              startIcon={<FiLogOut size={16} />}
              sx={{
                minWidth: 'auto',
                px: { xs: 1, sm: 2 },
                '& .MuiButton-startIcon': {
                  mr: { xs: 0, sm: 1 },
                },
              }}
            >
              <Box
                component="span"
                sx={{ display: { xs: 'none', sm: 'inline' } }}
              >
                {t('logout')}
              </Box>
            </Button>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
