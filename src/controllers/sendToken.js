import dotenv from 'dotenv';
import {ethers} from 'ethers';

import {abi} from '../abi/abi.js';
import {config} from '../config/index.js';

dotenv.config();

const MIN_GAS_LIMIT = ethers.utils.parseUnits('21000', 'wei');
const MAX_GAS_LIMIT = ethers.utils.parseUnits('500000', 'wei');

export const sendToken = async (req, res) => {
  const {amount, privateKey, walletAddress, tokenContract, recipient} =
    req.body;

  if (
    !amount ||
    !privateKey ||
    !walletAddress ||
    !tokenContract ||
    !recipient
  ) {
    res.status(400).send({
      error: 'Missing required parameters',
      message: 'Missing required parameters',
    });
    return;
  }

  try {
    const provider = new ethers.providers.JsonRpcProvider(config.RPC_URL);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(tokenContract, abi, wallet);
    const decimals = await contract.decimals();
    const amountInWei = ethers.utils.parseUnits(amount, decimals);
    const to = tokenContract;
    const data = contract.interface.encodeFunctionData('transfer', [
      recipient,
      amountInWei,
    ]);
    const gasPrice = await provider.getGasPrice();
    const gasPriceAdjusted = gasPrice.mul(150).div(100);
    const estimateGas = await contract.estimateGas.transfer(
      recipient,
      amountInWei,
    );
    let gasLimit = estimateGas.mul(150).div(100);

    const networkFee = gasPriceAdjusted.mul(gasLimit);
    console.log('Network fee:', ethers.utils.formatEther(networkFee), 'MATIC');

    if (gasLimit.lt(MIN_GAS_LIMIT)) {
      gasLimit = MIN_GAS_LIMIT;
    } else if (gasLimit.gt(MAX_GAS_LIMIT)) {
      gasLimit = MAX_GAS_LIMIT;
    }

    const nonce = await provider.getTransactionCount(walletAddress);
    const tx = {
      to,
      data,
      gasPrice: gasPriceAdjusted,
      gasLimit,
      nonce,
      chainId: (await provider.getNetwork()).chainId,
    };

    const signedTx = await wallet.signTransaction(tx);
    const receipt = await provider.sendTransaction(signedTx);
    console.log('Transaction receipt:', receipt.hash);
    res.status(200).send('Transaction sent successfully');
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('An error occurred while sending the transaction');
  }
};
