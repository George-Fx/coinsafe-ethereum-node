export const validateAddress = (req, res) => {
  if (!req.body.walletAddress) {
    return res.status(400).send({error: 'Invalid wallet address'});
  }

  if (req.body.walletAddress.length !== 42) {
    return res.status(400).send({error: 'Invalid wallet address'});
  }

  if (!req.body.walletAddress.startsWith('0x')) {
    return res.status(400).send({error: 'Invalid wallet address'});
  }

  return true;
};
