const { Router } = require("express");

const router = Router();

const { addPost } = require("../controllers/postController");
const { verifyAdmin } = require("../middlewares/verifyAdmin");

router.post("/addpost", verifyAdmin, addPost);

module.exports = router;
