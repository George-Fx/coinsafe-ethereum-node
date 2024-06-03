import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

import {config} from '../config/index.js';

const COIN_GECKO_API_KEY = process.env.COIN_GECKO_API_KEY;

export const getPrices = async (tokens) => {
  const ids = tokens.map((token) => token.id).join(',');

  const response = await axios.get(config.COIN_GECKO_SIMPLE_PRICE, {
    headers: {'X-CMC_PRO_API_KEY': COIN_GECKO_API_KEY},
    params: {ids, vs_currencies: 'usd'},
  });

  const prices = response.data;

  return tokens.map((token) => {
    const priceData = prices[token.id];
    if (priceData) {
      return {...token, price: priceData.usd};
    }
    return token;
  });
};
