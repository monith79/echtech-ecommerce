import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#673ab7', // Deep Purple
    },
    secondary: {
      main: '#ffc107', // Amber
    },
    background: {
      default: '#f5f5f5', // Light grey background
      paper: '#ffffff', // White for cards, etc.
    },
    text: {
      primary: '#212121', // Dark grey for main text
      secondary: '#757575', // Medium grey for secondary text
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 500 },
    h2: { fontSize: '2rem', fontWeight: 500 },
    h3: { fontSize: '1.75rem', fontWeight: 500 },
    h4: { fontSize: '1.5rem', fontWeight: 500 },
    h5: { fontSize: '1.25rem', fontWeight: 500 },
    h6: { fontSize: '1rem', fontWeight: 500 },
    body1: { fontSize: '1rem' },
    body2: { fontSize: '0.875rem' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Slightly rounded buttons
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12, // More rounded cards
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', // Softer shadow
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '.MuiOutlinedInput-root': {
            borderRadius: 8, // Rounded text fields
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12, // Rounded paper elements
        },
      },
    },
  },
});

export default theme;
