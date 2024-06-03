import dotenv from 'dotenv';
import {ethers} from 'ethers';

import {config} from '../config/index.js';

dotenv.config();

const MIN_GAS_LIMIT = ethers.utils.parseUnits('21000', 'wei');
const MAX_GAS_LIMIT = ethers.utils.parseUnits('500000', 'wei');

export const estimateFeeEth = async (req, res) => {
  const {amount, privateKey, walletAddress, recipient} = req.body;

  if (!amount || !privateKey || !walletAddress || !recipient) {
    res.status(400).send({
      error: 'Missing required parameters',
      message: 'Missing required parameters',
    });
    return;
  }

  try {
    const provider = new ethers.providers.JsonRpcProvider(config.RPC_URL);
    const wallet = new ethers.Wallet(privateKey, provider);
    const amountInWei = ethers.utils.parseUnits(amount, 'ether');
    const gasPrice = await provider.getGasPrice();
    const gasPriceAdjusted = gasPrice.mul(150).div(100);
    const estimateGas = await wallet.estimateGas({
      to: recipient,
      value: amountInWei,
    });
    let gasLimit = estimateGas.mul(150).div(100);

    if (gasLimit.lt(MIN_GAS_LIMIT)) {
      gasLimit = MIN_GAS_LIMIT;
    } else if (gasLimit.gt(MAX_GAS_LIMIT)) {
      gasLimit = MAX_GAS_LIMIT;
    }

    const networkFee = gasPriceAdjusted.mul(gasLimit);

    res.status(200).send({estimatedFee: ethers.utils.formatEther(networkFee)});
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('An error occurred while estimating the fee');
  }
};
