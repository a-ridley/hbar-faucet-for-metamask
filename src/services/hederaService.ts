import { AccountId, Client, PrivateKey, TransactionReceiptQuery, TransferTransaction } from "@hashgraph/sdk"

export const sendHbar = async (client:Client, fromAddress: AccountId | string, toAddress: AccountId | string, amount: number, operatorPrivateKey: PrivateKey) => {
  const transferHbarTransaction = new TransferTransaction()
    .addHbarTransfer(fromAddress, -amount)
    .addHbarTransfer(toAddress, amount)
    .freezeWith(client);

  const transferHbarTransactionSigned = await transferHbarTransaction.sign(operatorPrivateKey);
  const transferHbarTransactionResponse = await transferHbarTransactionSigned.execute(client);

  // Get the child receipt or child record to return the Hedera Account ID for the new account that was created
  const transactionReceipt = await new TransactionReceiptQuery()
    .setTransactionId(transferHbarTransactionResponse.transactionId)
    .setIncludeChildren(true)
    .execute(client);

  const childReceipt = transactionReceipt.children[0];

  if(!childReceipt || childReceipt.accountId === null) {
    console.warn(`No account id was found in child receipt. Child Receipt: ${JSON.stringify(childReceipt, null, 4)}`);
    return;
  }

   const newAccountId = childReceipt.accountId.toString();
   console.log(`Account ID of the newly created account: ${newAccountId}`);
}