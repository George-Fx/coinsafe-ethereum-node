export const calcTotalUsd = (tokens) => {
  return tokens.reduce((total, token) => total + token.balanceInUsd, 0);
};
