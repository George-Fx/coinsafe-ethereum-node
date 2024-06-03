import {ethers} from 'ethers';

export const getTokens = async (token, abi, provider, walletAddress) => {
  const contract = new ethers.Contract(token.address, abi, provider);
  const [decimals, balance] = await Promise.all([
    contract.decimals(),
    contract.balanceOf(walletAddress),
  ]);
  const balanceInToken = ethers.utils.formatUnits(balance, decimals);
  const balanceInUsd = balanceInToken * token.price;
  return {...token, balanceInToken, balanceInUsd};
};
