const { Router } = require("express");
const router = Router();

const { checkEmailAndPassword } = require(
  "../middlewares/checkEmailAndPassword",
);

const {
  signup,
  activateAccount,
  login,
  changePassword,
  requestPasswordReset,
  getPasswordResetForm,
  resetPassword,
  deleteUser,
} = require(
  "../controllers/authController",
);

router.post("/signup", checkEmailAndPassword, signup);
router.get("/activate/:token", activateAccount);
router.post("/login", login);
router.post("/changepassword", changePassword);
router.post("/requestpasswordreset", requestPasswordReset);
router.get("/resetpassword/:token", getPasswordResetForm);
router.post("/resetpassword", resetPassword);
router.delete("/deleteuser", deleteUser);

module.exports = router;
