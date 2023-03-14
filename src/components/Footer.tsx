import { Box, Typography, Container, Link } from '@mui/material';
import BuiltOnHedera from "../assets/built-on-hedera.svg";

export default function Footer() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 3,
          mt: 'auto',
          backgroundColor:  "#F9F9F9"
        }}
      >
          <img src={BuiltOnHedera} style={{
          height: '60px',
          width: 'auto',
        }} />
      </Box>
    </Box>
  );
}