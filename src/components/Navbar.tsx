import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import HBARLogo from "../assets/hbar-logo.svg";

export default function NavBar() {
  return (
    <AppBar
      position="relative"
      sx={{
        backgroundColor: "#F9F9F9"
      }}
    >
      <Toolbar>
        <img src={HBARLogo} style={{
          width: '36px',
          height: 'auto'
        }} />
        <Typography variant="h6" color="black" pl={1} noWrap>
          Happy Building
        </Typography>

        <Button
          variant="contained"
          sx={{
            ml: "auto"
          }}
        >
          Button
        </Button>
      </Toolbar>
    </AppBar>
  )
}