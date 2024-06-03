import axios from 'axios';
import dotenv from 'dotenv';

import {validation} from '../validation/index.js';

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

dotenv.config();

export const getTransactions = async (req, res) => {
  try {
    validation.validateAddress(req, res);
    const walletAddress = req.body.walletAddress;

    const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&sort=asc&apikey=${ETHERSCAN_API_KEY}`;
    const response = await axios.get(url);
    const transactions = response.data.result;

    res.send({data: transactions});
  } catch (error) {
    console.log(error);
  }
};
