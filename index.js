const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const mysql = require("mysql2"); // Import mysql2 package

require("dotenv").config();

const app = express();
app.use(cors());
const PORT = 3000;

// MySQL database connection configuration
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL database:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
}).single("image");

// Handle image upload
app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error("Error uploading image:", err);
      return res.status(500).json({ error: "Error uploading image" });
    }

    // Extract filename and coordinates from request body
    const filename = req.file.filename;
    const x = req.body.x;
    const y = req.body.y;

    // Insert image data into MySQL database
    connection.query(
      "INSERT INTO images (url, x, y) VALUES (?, ?, ?)",
      [filename, x, y],
      (err, result) => {
        if (err) {
          console.error("Error inserting image into database:", err);
          return res
            .status(500)
            .json({ error: "Error inserting image into database" });
        }
        console.log("Image uploaded and inserted into database:", filename);
        res.json({ message: "Image uploaded successfully" });
      }
    );
  });
});

// Handle image retrieval
app.get("/images", (req, res) => {
  const { minX, maxX, minY, maxY } = req.query;
  // Query images from MySQL database based on the visible area
  connection.query(
    "SELECT * FROM images WHERE x BETWEEN ? AND ? AND y BETWEEN ? AND ?",
    [minX, maxX, minY, maxY],
    (err, results) => {
      if (err) {
        console.error("Error fetching images from database:", err);
        return res
          .status(500)
          .json({ error: "Error fetching images from database" });
      }
      const images = results.map((row) => ({
        url: `${row.url}`,
        x: row.x,
        y: row.y,
      }));
      res.json(images);
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
