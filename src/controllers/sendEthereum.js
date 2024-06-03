import dotenv from 'dotenv';
import Web3 from 'web3';

import {config} from '../config/index.js  ';

dotenv.config();

export const sendEthereum = async (req, res) => {
  const {amount, privateKey, recipient} = req.body;

  try {
    const web3 = new Web3(new Web3.providers.HttpProvider(config.RPC_URL));

    const MIN_GAS_PRICE = web3.utils.toWei('1', 'gwei');
    const MAX_GAS_PRICE = web3.utils.toWei('100', 'gwei');

    const gasPrice = await web3.eth.getGasPrice();
    let adjustedGasPrice = Math.round(gasPrice * 1.5);

    const amountInMatic = amount;
    const amountInWei = web3.utils.toWei(amountInMatic.toString(), 'ether');

    const rootAccount = web3.eth.accounts.privateKeyToAccount(privateKey);

    web3.eth.accounts.wallet.add(rootAccount);
    web3.eth.defaultAccount = rootAccount.address;

    const transactionObject = {
      from: rootAccount.address,
      to: recipient,
      value: amountInWei,
    };

    transactionObject.gas = await web3.eth.estimateGas(transactionObject);
    if (web3.utils.toBN(adjustedGasPrice).lt(web3.utils.toBN(MIN_GAS_PRICE))) {
      adjustedGasPrice = MIN_GAS_PRICE;
    }

    if (web3.utils.toBN(adjustedGasPrice).gt(web3.utils.toBN(MAX_GAS_PRICE))) {
      adjustedGasPrice = MAX_GAS_PRICE;
    }

    transactionObject.gasPrice = adjustedGasPrice;

    const signedTransaction = await web3.eth.accounts.signTransaction(
      transactionObject,
      privateKey,
    );

    const transactionReceipt = await web3.eth.sendSignedTransaction(
      signedTransaction.rawTransaction,
    );

    if (transactionReceipt.status) {
      console.log(
        'Transaction was successful',
        transactionReceipt.transactionHash,
      );
      res
        .status(200)
        .send({message: 'Transaction was successful', transactionReceipt});
    }

    if (!transactionReceipt.status) {
      console.log('Transaction failed', transactionReceipt);
      res.status(400).send({error: 'Transaction failed', transactionReceipt});
    }
  } catch (error) {
    console.error('error sending the transaction', error);
    res.status(500).send({error: error.message});
  }
};
