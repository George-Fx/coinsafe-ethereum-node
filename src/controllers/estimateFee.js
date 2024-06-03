import dotenv from 'dotenv';
import {ethers} from 'ethers';

import {abi} from '../abi/abi.js';
import {config} from '../config/index.js';
import {validation} from '../validation/index.js';

dotenv.config();

const MIN_GAS_LIMIT = ethers.utils.parseUnits('21000', 'wei');
const MAX_GAS_LIMIT = ethers.utils.parseUnits('500000', 'wei');

export const estimateFee = async (req, res) => {
  const {amount, privateKey, tokenContract, recipient} = req.body;

  if (!validation.validateFee(req, res)) return;

  try {
    const provider = new ethers.providers.JsonRpcProvider(config.RPC_URL);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(tokenContract, abi, wallet);
    const decimals = await contract.decimals();
    const amountInWei = ethers.utils.parseUnits(amount, decimals);
    const gasPrice = await provider.getGasPrice();
    const gasPriceAdjusted = gasPrice.mul(150).div(100);
    const estimateGas = await contract.estimateGas.transfer(
      recipient,
      amountInWei,
    );
    let gasLimit = estimateGas.mul(150).div(100);

    if (gasLimit.lt(MIN_GAS_LIMIT)) {
      gasLimit = MIN_GAS_LIMIT;
    } else if (gasLimit.gt(MAX_GAS_LIMIT)) {
      gasLimit = MAX_GAS_LIMIT;
    }

    const networkFee = gasPriceAdjusted.mul(gasLimit);

    res.status(200).send({estimatedFee: ethers.utils.formatEther(networkFee)});
  } catch (err) {
    console.log('Error:', err);
    res.status(500).send('An error occurred while estimating the fee');
  }
};
