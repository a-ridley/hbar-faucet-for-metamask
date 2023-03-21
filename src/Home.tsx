import { AccountId, Client, PrivateKey } from "@hashgraph/sdk";
import { Button, Stack, Typography } from "@mui/material";
import { useContext } from "react";
import { GlobalAppContext } from "./contexts/GlobalAppContext";
import { sendHbar } from './services/hederaService'


export default function Home() {
  const { metamaskAccountAddress } = useContext(GlobalAppContext);

  // If we weren't able to grab it, we should throw a new error
  if (!process.env.REACT_APP_MY_ACCOUNT_ID || !process.env.REACT_APP_MY_PRIVATE_KEY) {
    throw new Error("Environment variables REACT_APP_MY_ACCOUNT_ID and REACT_APP_MY_PRIVATE_KEY must be present");
  }

  // create your client
  const myAccountId = AccountId.fromString(process.env.REACT_APP_MY_ACCOUNT_ID);
  const myPrivateKey = PrivateKey.fromString(process.env.REACT_APP_MY_PRIVATE_KEY);

  const client = Client.forTestnet();
  client.setOperator(myAccountId, myPrivateKey);

  return (
    <Stack 
      spacing={4}
      sx={{alignItems: 'center'}}
    >
      <Typography
        variant="h4"
        color="white"
      >
        Let's buidl a dApp on Hedera
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          sendHbar(client, myAccountId, AccountId.fromEvmAddress(0, 0, metamaskAccountAddress), 7, myPrivateKey)
        }}
      >
        Transfer HBAR to MetaMask Account
      </Button>
    </Stack>
  )
}
