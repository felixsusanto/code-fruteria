import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
const port = 3000;

app.use(express.json());

app.post("/auth", (req, res) => {
  const { username, password } = req.body;
  if (username !== "admin" || password !== "1234") {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  res.json({ message: "Authorization successful", username });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
