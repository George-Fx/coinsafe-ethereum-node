export const validateBalance = (tokens, walletAddress, res) => {
  if (!Array.isArray(tokens)) {
    res.status(400).send({error: 'Tokens must be an array'});
    return false;
  }

  if (!walletAddress.startsWith('0x')) {
    res.status(400).send({error: 'Invalid wallet address'});
    return false;
  }

  return true;
};
