import { AccountId } from "@hashgraph/sdk";
import { NetworkConfig } from "../../config";

export interface MirrorNodeAccountTokenBalance {
  balance: number,
  token_id: string,
}

export interface MirrorNodeTokenInfo {
  type: 'FUNGIBLE_COMMON' | 'NON_FUNGIBLE_UNIQUE',
  decimals: string,
  name: string,
  symbol: string
  token_id: string,
}

export interface MirrorNodeNftInfo {
  token_id: string,
  serial_number: number,
}

export interface MirrorNodeAccountTokenBalanceWithInfo extends MirrorNodeAccountTokenBalance {
  info: MirrorNodeTokenInfo,
  nftSerialNumbers?: number[],
}

export class MirrorNodeClient {
  url: string;
  constructor(networkConfig: NetworkConfig) {
    this.url = networkConfig.mirrorNodeUrl;
  }



  // Purpose: get token balances for an account
  // Returns: an array of MirrorNodeAccountTokenBalance
  async getAccountTokenBalances(accountId: AccountId) {
    // get token balances
    const tokenBalanceInfo = await fetch(`${this.url}/api/v1/accounts/${accountId}/tokens?limit=100`, { method: "GET" });
    const tokenBalanceInfoJson = await tokenBalanceInfo.json();

    const tokenBalances = [...tokenBalanceInfoJson.tokens] as MirrorNodeAccountTokenBalance[];

    // because the mirror node API paginates results, we need to check if there are more results
    // if links.next is not null, then there are more results and we need to fetch them until links.next is null
    let nextLink = tokenBalanceInfoJson.links.next;
    while (nextLink !== null) {
      const nextTokenBalanceInfo = await fetch(`${this.url}${nextLink}`, { method: "GET" });
      const nextTokenBalanceInfoJson = await nextTokenBalanceInfo.json();
      tokenBalances.push(...nextTokenBalanceInfoJson.tokens);
      nextLink = nextTokenBalanceInfoJson.links.next;
    }

    return tokenBalances;
  }

  // Purpose: get token info for a token
  // Returns: a MirrorNodeTokenInfo 
  async getTokenInfo(tokenId: string) {
    const tokenInfo = await fetch(`${this.url}/api/v1/tokens/${tokenId}`, { method: "GET" });
    const tokenInfoJson = await tokenInfo.json() as MirrorNodeTokenInfo;
    return tokenInfoJson;
  }

  // Purpose: get NFT Infor for an account
  // Returns: an array of NFTInfo
  async getNftInfo(accountId: AccountId) {
    const nftInfo = await fetch(`${this.url}/api/v1/accounts/${accountId}/nfts?limit=100`, { method: "GET" });
    const nftInfoJson = await nftInfo.json();

    const nftInfos = [...nftInfoJson.nfts] as MirrorNodeNftInfo[];

    // because the mirror node API paginates results, we need to check if there are more results
    // if links.next is not null, then there are more results and we need to fetch them until links.next is null
    let nextLink = nftInfoJson.links.next;
    while (nextLink !== null) {
      const nextNftInfo = await fetch(`${this.url}${nextLink}`, { method: "GET" });
      const nextNftInfoJson = await nextNftInfo.json();
      nftInfos.push(...nextNftInfoJson.nfts);
      nextLink = nextNftInfoJson.links.next;
    }
    return nftInfos;
  }

  // Purpose: get token balances for an account with token info in order to display token balance, token type, decimals, etc.
  // Returns: an array of MirrorNodeAccountTokenBalanceWithInfo
  async getAccountTokenBalancesWithTokenInfo(accountId: AccountId): Promise<MirrorNodeAccountTokenBalanceWithInfo[]> {
    //1.  Retrieve all token balances in the account
    const tokens = await this.getAccountTokenBalances(accountId);
    //2. Create a map of token IDs to token info and fetch token info for each token
    const tokenInfos = new Map<string, MirrorNodeTokenInfo>();
    for (const token of tokens) {
      const tokenInfo = await this.getTokenInfo(token.token_id);
      tokenInfos.set(tokenInfo.token_id, tokenInfo);
    }

    //3. Fetch all NFT info in account
    const nftInfos = await this.getNftInfo(accountId);

    //4. Create a map of token Ids to arrays of serial numbers
    const tokenIdToSerialNumbers = new Map<string, number[]>();
    for (const nftInfo of nftInfos) {
      const tokenId = nftInfo.token_id;
      const serialNumber = nftInfo.serial_number;

      // if we haven't seen this token_id before, create a new array with the serial number
      if (!tokenIdToSerialNumbers.has(tokenId)) {
        tokenIdToSerialNumbers.set(tokenId, [serialNumber]);
      } else {
        // if we have seen this token_id before, add the serial number to the array
        tokenIdToSerialNumbers.get(tokenId)!.push(serialNumber);
      }
    }

    //5. Combine token balances, token info, and NFT info and return
    return tokens.map(token => {
      return {
        ...token,
        info: tokenInfos.get(token.token_id)!,
        nftSerialNumbers: tokenIdToSerialNumbers.get(token.token_id)
      }
    });
  }

// Purpose: check if an account is associated with a token
// Returns: true if the account is associated with the token, false otherwise
async isAssociated(accountId: AccountId, tokenId: string) {
  const accountTokenBalance = await this.getAccountTokenBalances(accountId);
  return accountTokenBalance.some(token => token.token_id === tokenId);
}


  async getAccountInfo(accountId: AccountId) {
    const accountInfo = await fetch(`${this.url}/api/v1/accounts/${accountId}`, { method: "GET" });
    const accountInfoJson = await accountInfo.json();
    return accountInfoJson;
  }

}