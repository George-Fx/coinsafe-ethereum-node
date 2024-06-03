export const sortTokens = (tokens) => {
  return tokens.sort((a, b) => {
    if (a.symbol === 'eth') return -1;
    if (b.symbol === 'eth') return 1;

    return b.balanceInUsd - a.balanceInUsd;
  });
};
