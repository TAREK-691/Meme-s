const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const memeFile = path.join(__dirname, "meme.json");
let memes = [];

// meme.json থেকে ডাটা লোড করা
try {
  memes = JSON.parse(fs.readFileSync(memeFile, "utf8"));
} catch (err) {
  memes = [];
}

// ✅ সব meme দেখাবে
app.get("/tarek-api", (req, res) => {
  if (!memes || memes.length === 0) {
    return res.send("<h2>No memes found!</h2>");
  }

  const memeImages = memes
    .map((link) => `<div style="margin:10px"><img src="${link}" width="300"/></div>`)
    .join("");

  res.send(`
    <html>
      <head><title>Tarek API</title></head>
      <body style="display:flex;flex-wrap:wrap">
        ${memeImages}
      </body>
    </html>
  `);
});

// ✅ JSON ফরম্যাটে meme list
app.get("/json", (req, res) => {
  res.json(memes);
});

// ✅ Messenger থেকে auto add করা হবে
app.post("/add-meme", express.json(), (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "⚠️ Meme URL required!" });
  }

  // duplicate check
  if (memes.includes(url)) {
    return res.json({ success: false, message: "⚠️ Meme already exists!" });
  }

  memes.push(url);
  fs.writeFileSync(memeFile, JSON.stringify(memes, null, 2));

  res.json({ success: true, message: "✅ Meme added successfully!", url });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
