'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useRouter } from '@/i18n/routing';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import Sidebar, { DRAWER_WIDTH } from './Sidebar';
import DashboardHeader from './DashboardHeader';
import { MenuGroup, teacherMenuItems, studentMenuItems } from './menuItems';
import { useAuthContext } from '../../../AuthContext';

interface DashboardLayoutProps {
  children: ReactNode;
  userType: 'teacher' | 'student';
}

export default function DashboardLayout({ children, userType }: DashboardLayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { token } = useAuthContext();
  const router = useRouter();

  // Auth protection
  useEffect(() => {
    if (token === null) {
      router.push('/');
    }
  }, [token, router]);

  // Close mobile drawer when switching to desktop
  useEffect(() => {
    if (!isMobile) {
      setMobileOpen(false);
    }
  }, [isMobile]);

  // Get menu items based on user type
  const menuItems: MenuGroup[] = userType === 'teacher' ? teacherMenuItems : studentMenuItems;

  const handleMenuToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  const handleMobileClose = () => {
    setMobileOpen(false);
  };

  // Don't render until auth is checked
  if (!token) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar - Desktop (permanent) - only render when open */}
      {!isMobile && sidebarOpen && (
        <Sidebar
          menuItems={menuItems}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          variant="permanent"
        />
      )}

      {/* Sidebar - Mobile (temporary) */}
      {isMobile && (
        <Sidebar
          menuItems={menuItems}
          open={mobileOpen}
          onClose={handleMobileClose}
          variant="temporary"
        />
      )}

      {/* Header */}
      <DashboardHeader
        onMenuToggle={handleMenuToggle}
        sidebarOpen={!isMobile && sidebarOpen}
        userType={userType}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${sidebarOpen ? DRAWER_WIDTH : 0}px)` },
          minHeight: '100vh',
          backgroundColor: 'background.default',
          transition: (theme) =>
            theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
        }}
      >
        {/* Toolbar spacer - pushes content below the AppBar */}
        <Toolbar />

        {/* Page Content */}
        <Box sx={{ py: 2 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
