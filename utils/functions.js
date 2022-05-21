const generateToken = () => {
  const SACK = "1234567890";
  const SACK_LENGTH = SACK.length;
  const TOKEN_LENGTH = 5;

  let token = "";

  for (let i = 0; i < TOKEN_LENGTH; i++) {
    token += SACK[Math.floor(Math.random() * SACK_LENGTH)];
  }

  return token;
};

module.exports = {
  generateToken,
};
