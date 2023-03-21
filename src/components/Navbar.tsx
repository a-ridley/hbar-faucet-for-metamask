import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import { useContext } from 'react';
import HBARLogo from "../assets/hbar-logo.svg";
import { GlobalAppContext } from '../contexts/GlobalAppContext';
import { connectToMetamask } from '../services/metamaskService';


export default function NavBar() {
  // use the GlobalAppContext to keep track of the metamask account connection
  const { metamaskAccountAddress, setMetamaskAccountAddress } = useContext(GlobalAppContext);

  const retrieveWalletAddress = async () => {
    const addresses = await connectToMetamask();
    if (addresses) {
      // grab the first wallet address
      setMetamaskAccountAddress(addresses[0]);
      console.log(addresses[0]);
    }
  }

  return (
    <AppBar
      position="relative" color='primary'>
      <Toolbar>
        <img src={HBARLogo} className='hbarLogoImg' />
        <Typography variant="h6" color="white" pl={1} noWrap>
          Happy Building
        </Typography>

        <Button
          variant='contained'
          color='secondary'
          sx={{
            ml: 'auto'
          }}
          onClick={retrieveWalletAddress}
        >
          {metamaskAccountAddress === "" ?
            "Connect to MetaMask" :
            `Connected to: ${metamaskAccountAddress.substring(0, 8)}...`}
        </Button>
      </Toolbar>
    </AppBar>
  )
}