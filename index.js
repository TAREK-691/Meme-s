const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const memeFile = path.join(__dirname, "meme.json");
let memes = [];

try {
  memes = JSON.parse(fs.readFileSync(memeFile, "utf8"));
} catch (err) {
  memes = [];
}

app.get("/", (req, res) => {
  if (!memes || memes.length === 0) {
    return res.send("<h2>No memes found!</h2>");
  }

  const memeImages = memes
    .map((link) => `<div style="margin:10px"><img src="${link}" width="300"/></div>`)
    .join("");

  res.send(`
    <html>
      <head><title>Meme API</title></head>
      <body style="display:flex;flex-wrap:wrap">
        ${memeImages}
      </body>
    </html>
  `);
});

app.get("/json", (req, res) => {
  res.json(memes);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
