const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

exports.sendAccountActivationLink = (
  senderDetail,
  secret,
  userEmail,
  userPassword,
) => {
  //create transporter
  const transporter = nodemailer.createTransport(senderDetail);

  //generate activation token with email, password and secret
  const token = jwt.sign(
    { userEmail, userPassword },
    secret,
    { expiresIn: "3m" },
  );

  // create email options
  const options = {
    from: "no-reply@email.com",
    to: userEmail,
    subject: "Please click the link below to activate your account",
    html: `<a href="http://localhost:4004/api/auth/activate/${token}"`,
  };
  transporter.sendMail(options, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Email sent: ", info.response);
    }
  });
};

exports.sendPasswordResetLink = (senderDetail, userEmail, secret) => {
  //create email transporter with sender email credentials from config file
  const transporter = nodemailer.createTransport(senderDetail);

  //generate token with requester's email
  const token = jwt.sign({ email: userEmail }, secret, {
    expiresIn: "5m",
  });
  const resetLink = `http://localhost:4004/api/auth/resetpassword/${token}`;
  const options = {
    from: "no-reply@email.com",
    to: userEmail,
    subject: "Password reset link",
    html:
      `<h3>Please click the link to reset your password. Of copy and paste the link in your browser's address bar.</h3> 
        <p> <a href="${resetLink}" >${resetLink}</a> </p>
        `,
  };
  //send email

  transporter.sendMail(options, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Email sent: ", info.response);
    }
  });
};
