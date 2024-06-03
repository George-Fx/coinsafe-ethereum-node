import dotenv from 'dotenv';
import {ethers} from 'ethers';

import {abi} from '../abi/abi.js';
import {utils} from '../utils/index.js';
import {config} from '../config/index.js';
import {getEthBalance} from './getEthBalance.js';
import {validation} from '../validation/index.js';

dotenv.config();

export const getBalance = async (req, res) => {
  const provider = new ethers.providers.JsonRpcProvider(config.RPC_URL);

  try {
    let {tokens, walletAddress} = req.body;
    if (!validation.validateBalance(tokens, walletAddress, res)) return;

    const ethBalance = await getEthBalance(walletAddress);
    tokens = await utils.getPrices(tokens);

    const tokenPromises = tokens.map((token) =>
      utils.getTokens(token, abi, provider, walletAddress),
    );

    tokens = await Promise.all(tokenPromises);
    tokens = utils.sortTokens([...tokens, ethBalance]);

    const totalBalanceInUsd = utils.calcTotalUsd(tokens);

    res.status(200).send({tokens, totalBalanceInUsd});
  } catch (error) {
    console.error(error);
    res.status(500).send({error: 'An error occurred'});
  }
};
