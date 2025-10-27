import express from "express";
import cors from "cors";
import { issueRoute } from "./routes/issue.route.ts";
import { staffRoute } from "./routes/staff.route.ts";

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use((_req, res, next) => {
  res.locals.questTime = Date.now();

  next();
});

app.use("/v1", issueRoute);
app.use("/v1", staffRoute);

export default app;
