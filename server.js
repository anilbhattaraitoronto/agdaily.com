const express = require("express");
const path = require("path");
const cors = require("cors");
const DB = require("./schema");
const bodyParser = require("body-parser");

const app = express();

const PORT = 4004 || process.env.PORT;

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: "2mb", extended: true }));

app.use(express.static(path.resolve(__dirname, "client/public")));
//import routes

const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`App is running on port: ${PORT}`);
});
