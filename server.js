const express = require("express");
const bcrypt = require("bcryptjs");
const { v4: uuid } = require("uuid");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

const app = express();
const PORT = process.env.PORT || 3000;

// ---- CLOUDINARY CONFIG ----
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "odds101hub",
    allowed_formats: ["jpg", "png", "jpeg"]
  }
});
const upload = multer({ storage });

// ---- IN-MEMORY STORAGE (DEMO SAFE) ----
const users = [];
const payments = [];

// ---- MIDDLEWARE ----
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// ---- AUTH ----
app.post("/api/signup", async (req, res) => {
  const { email, password } = req.body;
  if (users.find(u => u.email === email)) {
    return res.json({ status: "error" });
  }
  users.push({
    id: uuid(),
    email,
    password: await bcrypt.hash(password, 10),
    role: "user"
  });
  res.json({ status: "success" });
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.json({ status: "error" });
  }
  res.json({ status: "success", role: user.role });
});

// ---- UPLOAD PAYMENT PROOF ----
app.post("/upload", upload.single("proof"), (req, res) => {
  const { phone, method, txRef } = req.body;

  payments.push({
    id: uuid(),
    phone,
    method,
    txRef,
    image: req.file.path,
    status: "Pending"
  });

  res.json({ status: "success" });
});

// ---- ADMIN ----
app.get("/api/payments", (req, res) => {
  res.json(payments);
});

app.post("/api/update", (req, res) => {
  const { id, status } = req.body;
  const p = payments.find(p => p.id === id);
  if (p) p.status = status;
  res.json({ status: "ok" });
});

// ---- START ----
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
