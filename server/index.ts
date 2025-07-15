import express from "express";
import cors from "cors";
import { FruitType, historicGenerator, HistoricValue } from "./script/generator";

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

app.get("/historic/:fruit", (req, res) => {
  const { fruit } = req.params;
  const { id, from: fromQuery, to: toQuery } = req.query;
  const from = fromQuery ? new Date(fromQuery as string) : new Date("2023-01-01");
  const to = toQuery ? new Date(toQuery as string) : new Date("2023-01-10");
  const g = historicGenerator(id as string, fruit as FruitType, from, to);
  const data: HistoricValue[] = [];
  for (const item of g) {
    data.push(item);
  }
  res.json(data);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
