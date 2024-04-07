import express = require("express");
import apiRouter from "./app/routes/v1/api";
import indexRouter from "./app/routes/index";
import cors from "cors";

import { Request, Response, NextFunction } from "express";
import dotenv from 'dotenv';
import bodyParser from "body-parser";

dotenv.config({ path: '.env.dev' });

const app: express.Application = express();
const port = process.env.PORT;



app.use(function (req: Request, res: Response, next: NextFunction) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

  // Request headers you wish to allow
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type,Authorization");

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Pass to next layer of middleware
  next();
});

app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 10000,
  })
);
app.use(bodyParser.json({ limit: "50mb" }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: "*" }));


app.use("/api/v1", apiRouter);
app.use("/", indexRouter);


app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

module.exports = app;