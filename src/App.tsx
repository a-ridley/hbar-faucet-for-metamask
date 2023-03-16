import React from 'react';
import Footer from './components/Footer';
import CssBaseline from '@mui/material/CssBaseline';
import NavBar from './components/Navbar';
import { Box } from '@mui/material';
import AppRouter from './AppRouter';
import { GlobalAppContextProvider } from './contexts/GlobalAppContext';

function App() {
  return (
    <GlobalAppContextProvider>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <header>
          <NavBar />
        </header>
        <Box
          flex={1}
          p={3}
        >
          <AppRouter />
        </Box>
        <Footer />
      </Box>
    </GlobalAppContextProvider>
  );
}

export default App;