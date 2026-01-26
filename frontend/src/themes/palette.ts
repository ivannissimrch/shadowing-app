// Berry Default Color Palette
// These are the signature colors that make Berry look professional

export const palette = {
  // Primary - Blue (used for main actions, links, highlights)
  primary: {
    light: '#e3f2fd',
    200: '#90caf9',
    main: '#2196f3',
    dark: '#1e88e5',
    800: '#1565c0',
  },

  // Secondary - Purple (used for accents, secondary actions)
  secondary: {
    light: '#ede7f6',
    200: '#b39ddb',
    main: '#673ab7',
    dark: '#5e35b1',
    800: '#4527a0',
  },

  // Success - Green
  success: {
    light: '#b9f6ca',
    200: '#69f0ae',
    main: '#00e676',
    dark: '#00c853',
  },

  // Error - Red
  error: {
    light: '#ef9a9a',
    main: '#f44336',
    dark: '#c62828',
  },

  // Warning - Yellow/Orange
  warning: {
    light: '#fff8e1',
    main: '#ffe57f',
    dark: '#ffc107',
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
