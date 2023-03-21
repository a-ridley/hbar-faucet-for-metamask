import Footer from './components/Footer';
import CssBaseline from '@mui/material/CssBaseline';
import NavBar from './components/Navbar';
import { Box, ThemeProvider } from '@mui/material';
import AppRouter from './AppRouter';
import { GlobalAppContextProvider } from './contexts/GlobalAppContext';
import colorBackground from './assets/colors.png';
import { theme } from './theme';
import "./App.css";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalAppContextProvider>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            backgroundColor: '#222222',
            backgroundImage: `url(${colorBackground})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center'
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
    </ThemeProvider>
  );
}

export default App;