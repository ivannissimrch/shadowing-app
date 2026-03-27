'use client';
import { useState, useEffect, ReactNode } from 'react';
import { useRouter } from '@/i18n/routing';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Sidebar, { DRAWER_WIDTH, MINI_DRAWER_WIDTH } from './Sidebar';
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

  useEffect(() => {
    if (token === null) {
      router.push('/');
    }
  }, [token, router]);
  
  useEffect(() => {
    if (!isMobile) {
      setMobileOpen(false);
    }
  }, [isMobile]);
  
  const menuItems: MenuGroup[] = userType === 'teacher' ? teacherMenuItems : studentMenuItems;
  function handleMenuToggle(){
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  function handleMobileClose(){
    setMobileOpen(false);
  };

  if (!token) {
    return null;
  }

  const currentDrawerWidth = sidebarOpen ? DRAWER_WIDTH : MINI_DRAWER_WIDTH;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {!isMobile && (
        <Sidebar
          menuItems={menuItems}
          open={true}
          onClose={() => setSidebarOpen(false)}
          variant="permanent"
          mini={!sidebarOpen}
          onExpand={() => setSidebarOpen(true)}
        />
      )}

      {isMobile && (
        <Sidebar
          menuItems={menuItems}
          open={mobileOpen}
          onClose={handleMobileClose}
          variant="temporary"
        />
      )}

      <DashboardHeader
        onMenuToggle={handleMenuToggle}
        sidebarOpen={!isMobile && sidebarOpen}
        userType={userType}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${currentDrawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: 'background.default',
          transition: (theme) =>
            theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
        }}
      >
        <Toolbar />

        <Box sx={{ py: 2 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
