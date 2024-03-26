import { Request, Response, NextFunction } from "express";
import express = require("express");

var router = express.Router();

router.all("/*", async function (req: Request, res: Response, next: NextFunction) {
    try {
      next();
    } catch (err: any) {
      console.log("===[api err :", err + "]===");
      res.status(400).json({ err: true, message: err.message });
    }
  }
);

router.get("/", (req: Request, res: Response) => {
  const data = {
    TxName : "test",
    Payload : {
      message :" OK"
    }
  }
  var tb = require('../../db/auth');
  try{
    tb.findAll().then((data:any) => {
      res.end(JSON.stringify(data));
    });
  }catch(e){
    res.end("Err:"+e);
  }finally{
    // res.end(JSON.stringify(data));
  }
  // res.json(data);
});

export default router;