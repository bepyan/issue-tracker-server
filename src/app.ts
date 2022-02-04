import "dotenv/config"; // env파일 사용
import cors from "cors";
import express from "express";
import jsonServer from "json-server";

import routes from "./routes";
import { loadPassport } from "./loaders";
import { errorResponser } from "./middlewares";

const app = express();
const PORT = process.env.PORT || 1234;

loadPassport();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/json", jsonServer.defaults(), jsonServer.router("db.json"));
app.use("/api", routes);

app.use(errorResponser);

app.listen(PORT, () => {
  console.log(`
  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  ┃     http://localhost:${PORT}/api       ┃
  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  `);
});
