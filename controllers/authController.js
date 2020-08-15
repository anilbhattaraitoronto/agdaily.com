const path = require("path");
const DB = require("../schema");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const jwt = require("jsonwebtoken");
const { authsecret, emailConfig, emailsecret } = require("../config");
const { sendAccountActivationLink, sendPasswordResetLink } = require(
  "../middlewares/sendEmails",
);

//signup

exports.signup = (req, res) => {
  const { email, password } = req.body;
  sendAccountActivationLink(emailConfig, emailsecret, email, password);
  res.status(200).json(
    {
      success:
        "We have sent you an email with a link to activate your account.",
    },
  );
};

//activate account
exports.activateAccount = (req, res) => {
  let { token } = req.params;
  if (token) {
    //verify token and extract email and password
    jwt.verify(token, emailsecret, (err, decoded) => {
      if (err) {
        return res.status(403).json(
          { message: "Token is either invalid or expired" },
        );
      } else {
        const { userEmail, userPassword } = decoded;
        const hashedPassword = bcrypt.hashSync(userPassword, salt);
        const addUserStmt = DB.prepare(
          `INSERT INTO users (email, password) VALUES(?,?);`,
        );
        addUserStmt.run(userEmail, hashedPassword);
        return res.status(200).json(
          { message: "Your account is activated. Please proceed to login." },
        );
      }
    });
    //hash password
    //insert into users table the extracted values
  } else {
    return res.status(403).json(
      { message: "Token is required but not provided" },
    );
  }
};

//login
exports.login = (req, res) => {
  const { email, password } = req.body;
  const userToken = req.headers["x-access-token"];
  if (email && password) {
    //check if user with that email exist

    const getUserStmt = DB.prepare(
      `SELECT * FROM users WHERE email=?;`,
    );
    const user = getUserStmt.get(email);
    if (user) {
      //compare the password
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          return res.status(403).json(
            { message: "Invalid username or password. Try again." },
          );
        } else if (result === true) {
          //generate token with id and send token and
          const token = jwt.sign(
            { id: user.id, email: user.email, is_admin: user.is_admin },
            authsecret,
            { expiresIn: "180m" },
          );
          return res.status(200).json({
            email: user.email,
            status: user.is_admin,
            token: token,
          });
        } else {
          return res.status(403).json(
            { message: "Invalid password. Please try again." },
          );
        }
      });
    } else {
      return res.status(404).json(
        { message: "User with that email does not exist." },
      );
    }
  } else {
    res.status(400).json({ message: "Both fields are required" });
  }
};

//change password
exports.changePassword = (req, res) => {
  const token = req.headers["x-access-token"];
  if (token) {
    //verify token
    jwt.verify(token, authsecret, (err, decoded) => {
      if (err) {
        return res.status(403).json(
          { message: "Token is invalid or expired.", error: err },
        );
      } else {
        let { id } = decoded;
        //check if user with that id exists
        const getUserStmt = DB.prepare(`SELECT id FROM users WHERE id=?;`);
        const user = getUserStmt.get(id);
        if (user) {
          //check if passwords match
          const { password, confirmPassword } = req.body;
          if (password === confirmPassword) {
            //create hashed password
            const hashedPassword = bcrypt.hashSync(password, salt);
            //update password statement
            const updatePasswordStatement = DB.prepare(
              `UPDATE users SET password=? WHERE id=?;`,
            );
            updatePasswordStatement.run(hashedPassword, id);
            return res.status(200).json(
              {
                message:
                  "Password changed successfully. Please go ahead and login now.",
              },
            );
          } else {
            return res.status(400).json({ message: "Passwords do not match." });
          }
        } else {
          return res.status(404).json({ message: "User does not exist." });
        }
      }
    });
  } else {
    return res.status(403).json(
      { message: "Token is required to change password." },
    );
  }
};

//request password reset

exports.requestPasswordReset = (req, res) => {
  const { email } = req.body;
  if (email) {
    const getUserStmt = DB.prepare(`SELECT * FROM users WHERE email=?;`);
    const user = getUserStmt.get(email);
    if (user) {
      //send an email with link to password reset form
      sendPasswordResetLink(emailConfig, email, emailsecret);
      return res.status(200).json(
        { message: "We have emailed you the link to reset your password." },
      );
    } else {
      return res.status(404).json(
        { message: "User with that email does not exist." },
      );
    }
  } else {
    return res.status(404).json(
      {
        message:
          "You need to submit your account email to start password reset.",
      },
    );
  }
};

//get password reset link

exports.getPasswordResetForm = (req, res) => {
  const { token } = req.params;
  if (token) {
    //verify
    jwt.verify(token, emailsecret, (err, decoded) => {
      if (err) {
        return res.status(403).json(
          { message: "Token is either expired or invalid." },
        );
      } else {
        //extract email from the token
        const { email } = decoded;

        //check if user with thtat email exists

        const getUserStmt = DB.prepare(
          `SELECT email FROM users WHERE email=?;`,
        );
        const user = getUserStmt.get(email);
        if (user) {
          // templates to send
          const submitUrl = `http://localhost:4004/api/auth/resetpassword`;
          const resetPasswordForm = `
            <style>
            form{
                width:100%;
                max-width:450px;
                margin: 40px auto;
                line-height:1.7;
                background: lightgray;
                padding: 20px;
            }
            h3{
                text-align: center;
                font-size: 1.3em;
                padding: 20px 0;
            }
            input, label{
                display: block;
                width:95%;
                margin: 4px auto;
                padding: 4px;
            }
            input[type="submit"]{
                font-size: 1.1em;
                cursor:pointer;
            }
            </style>
                  <form action=${submitUrl} method="POST">
                  <h3>Reset Password </h3>
                      <label for="password">Type new password</label>
                      <input type="password" name="password" required >
                      <label for="confirmPassword">Re-type new password</label>
                      <input type="password" name="confirmPassword" required >
                      <input type="hidden" name="token" value=${token}>
                      <input type="submit" value="Reset Password" />
                  </form>`;
          return res.status(200).send(resetPasswordForm);
        } else {
          return res.status(404).json(
            { message: "The user with that email does not exist." },
          );
        }
      }
    });
  } else {
    return res.status(403).json(
      { message: "Token is required but not provided" },
    );
  }
};

//reset password
exports.resetPassword = (req, res) => {
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const token = req.body.token;
  //   const { token } = req.params;
  console.log(password, confirmPassword, token);
  //check if passwords match
  if (password === confirmPassword) {
    //check if token exists
    if (token) {
      //verify token
      jwt.verify(token, emailsecret, (err, decoded) => {
        if (err) {
          return res.status(403).json(
            { message: "Token is either expired or invalid." },
          );
        } else {
          //extract email from token
          const { email } = decoded;
          const getUserStmt = DB.prepare(`SELECT * FROM users WHERE email=?;`);
          const user = getUserStmt.get(email);
          if (user) {
            //hash the password
            const hashedPassword = bcrypt.hashSync(password, salt);
            //update user
            const updateUserStmt = DB.prepare(
              `UPDATE users SET password = ? WHERE email =?;`,
            );
            updateUserStmt.run(hashedPassword, email);
            return res.status(200).json(
              {
                message:
                  "Password reset successfully. Please proceed to login.",
              },
            );
          } else {
            return res.status(404).json(
              { message: "User with that email does not exist." },
            );
          }
        }
      });
    } else {
      return res.status(403).json(
        { message: "Token is required but not provided " },
      );
    }
  } else {
    return res.status(400).json(
      { message: "Passwords do not match. Please try again." },
    );
  }
};

//delete user
exports.deleteUser = (req, res) => {
  const token = req.headers["x-access-token"];
  if (token) {
    //verify token
    jwt.verify(token, authsecret, (err, decoded) => {
      if (err) {
        return res.status(403).json(
          { message: "Token is either expired or invalid." },
        );
      } else {
        const { id } = decoded;
        const getUserStmt = DB.prepare(`SELECT id FROM users WHERE id=?;`);
        const user = getUserStmt.get(id);
        if (user) {
          const deleteUserStmt = DB.prepare(`DELETE FROM users WHERE id=?;`);
          deleteUserStmt.run(id);
          return res.status(200).json(
            {
              message:
                "User successfully deleted. You can signup again if you want.",
            },
          );
        } else {
          return res.status(404).json(
            { message: "User with that id does not exist" },
          );
        }
      }
    });
  } else {
    return res.status(403).json({ message: "Need token but is not provided." });
  }
};
