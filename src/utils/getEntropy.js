export const getEntropy = (req, res) => {
  const wordCount = req.query.wordCount;
  let entropy;
  switch (wordCount) {
    case '12':
      entropy = 128;
      break;
    case '15':
      entropy = 160;
      break;
    case '18':
      entropy = 192;
      break;
    case '21':
      entropy = 224;
      break;
    case '24':
      entropy = 256;
      break;
    default:
      res
        .status(400)
        .send(
          'Invalid word count. It must be one of the following: 12, 15, 18, 21, 24',
        );
      return null;
  }
  return entropy;
};
