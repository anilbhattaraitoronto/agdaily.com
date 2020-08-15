const DB = require("../schema");

exports.addPost = (req, res) => {
  const { thumbnail, title, author, brief, content } = req.body;
  if (thumbnail && title && author && brief && content) {
    console.log(thumbnail);
    const addPostStmt = DB.prepare(
      `INSERT INTO posts (thumbnail, title, author, brief, content) VALUES(?,?,?,?,?);`,
    );
    const newPostId =
      addPostStmt.run(thumbnail, title, author, brief, content).lastInsertRowid;
    const getPostStmt = DB.prepare(`SELECT * FROM posts WHERE id=?;`);
    const newPost = getPostStmt.get(newPostId);
    return res.status(200).json({
      success: "Post added",
      post: newPost,
    });
  } else {
    return res.status(400).json({ message: "All fields are required." });
  }
};
