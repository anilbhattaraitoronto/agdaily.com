const DB = require("../schema");

exports.checkEmailAndPassword = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  if (email && password && confirmPassword) {
    if (password === confirmPassword) {
      const getUserStmt = DB.prepare(`SELECT email FROM users WHERE email=?;`);
      const user = getUserStmt.get(email);
      if (user) {
        return res.status(403).json(
          { message: "User with that email already exists" },
        );
      } else {
        next();
      }
    } else {
      return res.status(400).json({ message: "Passwords do not match." });
    }
  } else {
    return res.status(400).json({ message: "All the fields are required" });
  }
};
