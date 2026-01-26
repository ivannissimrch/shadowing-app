// Berry Default Color Palette
// These are the signature colors that make Berry look professional

export const palette = {
  // Primary - Blue (used for main actions, links, highlights)
  // Darker blue for WCAG AA contrast (4.5:1 with white)
  primary: {
    light: '#e3f2fd',
    200: '#90caf9',
    main: '#1976d2',  // Darker blue for better contrast
    dark: '#1565c0',
    800: '#0d47a1',
  },

  // Secondary - Purple (used for accents, secondary actions)
  secondary: {
    light: '#ede7f6',
    200: '#b39ddb',
    main: '#673ab7',
    dark: '#5e35b1',
    800: '#4527a0',
  },

  // Success - Green (with accessible contrast)
  success: {
    light: '#b9f6ca',
    200: '#69f0ae',
    main: '#2e7d32',  // Darker green for better contrast
    dark: '#1b5e20',
    contrastText: '#1b5e20',  // Dark green text on light bg
  },

  // Error - Red
  error: {
    light: '#ef9a9a',
    main: '#f44336',
    dark: '#c62828',
  },

  // Warning - Yellow/Orange (with accessible contrast)
  warning: {
    light: '#fff8e1',
    main: '#f9a825',  // Darker amber for better contrast
    dark: '#f57f17',
    contrastText: '#5d4037',  // Brown text on yellow bg for contrast
  },

  // Orange (extra color Berry uses)
  orange: {
    light: '#fbe9e7',
    main: '#ffab91',
    dark: '#d84315',
  },

  // Greys - Essential for text, borders, backgrounds
  grey: {
    50: '#f8fafc',
    100: '#eef2f6',
    200: '#e3e8ef',
    300: '#cdd5df',
    400: '#9da4ae',
    500: '#697586',
    600: '#4b5565',
    700: '#364152',
    900: '#121926',
  },

  // Paper and background colors
  background: {
    paper: '#ffffff',      // White - for cards/content
    default: '#e3e8ef',    // grey.200 - page background (better contrast on Mac)
  },

  // Text colors
  text: {
    primary: '#364152', // grey.700
    secondary: '#697586', // grey.500
    disabled: '#9da4ae', // grey.400
  },

  // Divider color
  divider: '#e3e8ef', // grey.200

  // Dark mode colors (for later)
  dark: {
    paper: '#111936',
    background: '#1a223f',
    level1: '#29314f',
    level2: '#212946',
    textTitle: '#d7dcec',
    textPrimary: '#bdc8f0',
    textSecondary: '#8492c4',
  },
};

export default palette;
