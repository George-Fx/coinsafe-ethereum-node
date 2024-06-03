import axios from 'axios';
import dotenv from 'dotenv';
import {ethers} from 'ethers';

import {config} from '../config/index.js';

dotenv.config();

export const getEthBalance = async (walletAddress) => {
  const provider = new ethers.providers.JsonRpcProvider(config.RPC_URL);

  if (!walletAddress.startsWith('0x')) {
    throw new Error('Invalid wallet address');
  }

  const url = 'https://api.coinbase.com/v2/prices/ETH-USD/spot';

  const response = await axios.get(url);
  const price = response.data.data.amount;

  const balance = await provider.getBalance(walletAddress);
  const balanceInEther = ethers.utils.formatEther(balance);

  return {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'eth',
    address: walletAddress,
    balanceInToken: balanceInEther,
    balanceInUsd: balanceInEther * price,
    price: price,
  };
};
