import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
const port = 3000;

app.use(express.json());

app.post("/auth", (req, res) => {
  const { username, password } = req.body;
  if (username !== "admin" || password !== "1234") {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }
  res.json({ message: "Authorization successful", user: username, email: `${username}@somemail.com` });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
