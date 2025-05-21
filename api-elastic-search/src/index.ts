import express, { Request, Response } from "express";
import dotenv from "dotenv";
// load environment variables
dotenv.config();

import dbSearchRouter from "./routes/dbSearchRouter";
import elasticSearchRouter from "./routes/elasticSearchRouter";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/searchDb", dbSearchRouter);
app.use("/searchElastic", elasticSearchRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from TypeScript + Express!");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
