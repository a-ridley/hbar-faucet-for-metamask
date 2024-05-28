import { Button, MenuItem, TextField, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useWalletInterface } from "../services/wallets/useWalletInterface";
import SendIcon from '@mui/icons-material/Send';
import { useEffect, useState } from "react";
import { AccountId, TokenId } from "@hashgraph/sdk";
import { MirrorNodeAccountTokenBalanceWithInfo, MirrorNodeClient } from "../services/wallets/mirrorNodeClient";
import { appConfig } from "../config";

const UNSELECTED_SERIAL_NUMBER = -1;

export default function Home() {
  const { walletInterface, accountId } = useWalletInterface();
  const [toAccountId, setToAccountId] = useState("");
  const [testHbarAmount, setTestHbarAmount] = useState<number | null>();

  const [amount, setAmount] = useState<number>(0);
  // include all of this necessary for dropdown
  const [availableTokens, setAvailableTokens] = useState<MirrorNodeAccountTokenBalanceWithInfo[]>([]);
  const [selectedTokenId, setSelectedTokenId] = useState<string>('');
  const [serialNumber, setSerialNumber] = useState<number>(UNSELECTED_SERIAL_NUMBER);

  const [tokenIdToAssociate, setTokenIdToAssociate] = useState("");

  // include all of this necessary for dropdown
  // Purpose: Get the account token balances with token info for the current account and set them to state
  useEffect(() => {
    if (accountId === null) {
      return;
    }
    const mirrorNodeClient = new MirrorNodeClient(appConfig.networks.testnet);
    // Get token balance with token info for the current account
    mirrorNodeClient.getAccountTokenBalancesWithTokenInfo(AccountId.fromString(accountId)).then((tokens) => {
      // set to state
      setAvailableTokens(tokens);
      console.log(tokens);
    }).catch((error) => {
      console.error(error);
    });
  }, [accountId])

  // include all of this necessary for dropdown
  // Filter out tokens with a balance of 0
  const tokensWithNonZeroBalance = availableTokens.filter((token) => token.balance > 0);
  // include all of this necessary for dropdown
  // Get the selected token balance with info
  const selectedTokenBalanceWithInfo = availableTokens.find((token) => token.token_id === selectedTokenId);

  // include all of this necessary for dropdown
  // reset amount and serial number when token id changes
  useEffect(() => {
    setAmount(0);
    setSerialNumber(UNSELECTED_SERIAL_NUMBER);
  }, [selectedTokenId]);

  return (
    <Stack alignItems="center" spacing={4}>
      <Typography
        variant="h4"
        color="white"
      >
        Let's buidl a dApp on Hedera
      </Typography>
      {walletInterface !== null && (
        <>
          <Stack
            direction='row'
            gap={2}
            alignItems='center'
          >
            <Typography>
              Transfer
            </Typography>
            <TextField
              type="number"
              value={testHbarAmount}
              onChange={(e) => {
                const num = Number.parseFloat(e.target.value);
                if (!Number.isNaN(num)) {
                  setTestHbarAmount(num);
                } else if (e.target.value === "") {
                  setTestHbarAmount(null);
                }
              }}
              label='amount'
            />
            {/* not included in the dropdown stage. this is in the association/send stage */}
            <Typography>
              test HBAR to
            </Typography>
            <TextField
              value={toAccountId}
              onChange={(e) => setToAccountId(e.target.value)}
              label='account id or evm address'
            />
            <Button
              variant='contained'
              onClick={async () => {
                if (testHbarAmount !== null && testHbarAmount !== undefined) {
                  await walletInterface.transferHBAR(AccountId.fromString(toAccountId), testHbarAmount);
                }
              }}
            >
              <SendIcon />
            </Button>
          </Stack>
        </>
      )}
    </Stack>
  )
}