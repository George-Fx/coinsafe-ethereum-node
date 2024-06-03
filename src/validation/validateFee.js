export const validateFee = (req, res) => {
  const {amount, privateKey, walletAddress, tokenContract, recipient} =
    req.body;

  if (
    !amount ||
    !privateKey ||
    !walletAddress ||
    !tokenContract ||
    !recipient
  ) {
    res.status(400).send({
      error: 'Missing required parameters',
      message: 'Missing required parameters',
    });
    return false;
  }

  return true;
};
