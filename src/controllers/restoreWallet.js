import {ethers} from 'ethers';

export const restoreWallet = async (req, res) => {
  try {
    const mnemonic = req.body.mnemonic;
    console.log('mnemonic:', mnemonic);

    if (!mnemonic) {
      return res.status(400).send('Mnemonic phrase is required');
    }

    const wallet = ethers.Wallet.fromMnemonic(mnemonic);

    const walletAddress = wallet.address;
    const privateKey = wallet.privateKey;
    const mnemonicPhrase = wallet.mnemonic.phrase;

    res.send({walletAddress, privateKey, mnemonicPhrase});
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('An error occurred while restoring the wallet');
  }
};
