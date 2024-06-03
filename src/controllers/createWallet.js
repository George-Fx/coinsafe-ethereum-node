import {ethers} from 'ethers';
import * as bip39 from 'bip39';

import {utils} from '../utils/index.js';

export const createWallet = async (req, res) => {
  const entropy = utils.getEntropy(req, res);
  if (entropy === null) return;

  try {
    const mnemonicPhrase = bip39.generateMnemonic(entropy);
    const wallet = ethers.Wallet.fromMnemonic(mnemonicPhrase);
    const walletAddress = wallet.address;
    const privateKey = wallet.privateKey;

    res.send({walletAddress, privateKey, mnemonicPhrase});
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('An error occurred while creating the wallet');
  }
};
