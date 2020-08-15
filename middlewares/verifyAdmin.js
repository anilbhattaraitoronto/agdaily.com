const jwt = require("jsonwebtoken");
const { authsecret } = require("../config");

exports.verifyAdmin = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (token) {
    jwt.verify(token, authsecret, (err, decoded) => {
      if (err) {
        return res.status(403).json(
          { message: "Token is either invalid or expired." },
        );
      } else {
        const { is_admin } = decoded;
        if (is_admin === 1) {
          next();
        } else {
          return res.status(403).json({ message: "You are not admin." });
        }
      }
    });
  } else {
    return res.status(403).json(
      { message: "Token is required but not provided" },
    );
  }
};
