require("dotenv").config();
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const { prototype } = require("jsonwebtoken/lib/JsonWebTokenError");
app.use(express.json());

const posts = [
  {
    name: "Sush",
    caption: "Lorem Ipsum is the best placeholder.",
  },
  {
    name: "Okay",
    caption: "Cheems is my spirit animal.",
  },
];

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.get("/posts", authenticateToken, (req, res) => {
  res.json(posts.filter((post) => post.username === req.user.username));
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const user = { name: username };
  const accessToken = jwt.sign(user, process.env.ACCESS_SECRET_TOKEN);
  res.json({ accessToken: accessToken });
});

app.listen(3000);
console.log("🔰 App listening to PORT: 3000");
