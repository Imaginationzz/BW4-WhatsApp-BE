const jwt = require("jsonwebtoken");
const UserModel = require("../../services/users/model");

const generateJWT = (payload, secret) =>
  new Promise((res, rej) =>
    jwt.sign(
      payload,
      secret,
      {
        expiresIn: "1w",
      },
      (err, token) => {
        if (err) rej(err);
        res(token);
      }
    )
  );

const validateJWT = (token, secret) =>
  new Promise((res, rej) =>
    jwt.verify(token, secret, (err, decoded) => {
      if (err) rej(err);
      res(decoded);
    })
  );

const authenticate = async (user) => {
  try {
    const access_token = await generateJWT(
      { _id: user._id },
      process.env.JWT_ACCESS_TOKEN_SECRET
    );
    // const refresh_token = await generateJWT(
    //   { _id: user._id },
    //   process.env.JWT_REFRESH_TOKEN_SECRET
    // );

    // user.refresh_token = user.refresh_token.concat({ refresh_token });
    // console.log(user);
    await user.save();
    return { access_token };
  } catch (error) {
    console.log(error);
  }
};

// const refreshTokens = async (oldRefreshToken) => {
//   const decoded = await generateJWT(
//     oldRefreshToken,
//     process.env.JWT_REFRESH_TOKEN_SECRET
//   );

//   const user = await UserModel.findOne({ _id: decoded._id });

//   if (!user) {
//     throw new Error("Access Forbidden");
//   }

//   const currentRefreshToken = user.refresh_token.find(
//     (token) => token.token === oldRefreshToken
//   );

//   if (!currentRefreshToken) {
//     throw new Error("Wrong Refresh Token");
//   }

//   const access_token = await generateJWT(
//     { _id: user._id },
//     process.env.JWT_ACCESS_TOKEN_SECRET
//   );
//   const refresh_token = await generateJWT(
//     { _id: user._id },
//     process.env.JWT_REFRESH_TOKEN_SECRET
//   );

//   const newRefreshTokens = user.refresh_token
//     .filter((token) => token.token !== oldRefreshToken)
//     .concat({ token: refresh_token });

//   user.refresh_token = [...newRefreshTokens];
//   await user.save();

//   return { access_token, refresh_token };
// };

module.exports = { authenticate, validateJWT };
