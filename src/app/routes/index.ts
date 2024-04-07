import express from "express";
import { Request, Response, NextFunction } from "express";
import { map, replace, isEmpty, isNil } from "ramda";
import bcrypt from "bcrypt";
import { auth } from "../controller/c_auth";
import { users } from "../controller/c_users";
import { accessToken, refreshToken } from "../middleware/token";


var router = express.Router();

router.post("/v1/login", async function (req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (isEmpty(email) || isEmpty(password)) {
      return res.status(400).json({ err: true, message: "Data Cannot Be Empty" });
    }

    if (isNil(email) || isNil(password)) {
      return res.status(400).json({ err: true, message: "Data Cannot Be Undefined Or Null" });
    }

    const {
      err,
      message,
      data: [data],
    } = await auth.getAccInfo(email);

    if (err != null) {
      console.log('3')
      // return res.status(400).json({ err: true, message: message });
      return res.json({ err: true,status:400, message: message });
    }
    if(data === undefined){
      return res.json({ err: true,status:400, message: "Login Fail" });
    }
    if (data.length === 0 || data.is_enabled === false) {
      console.log('4')
      // return res.status(400).json({ err: true, message: "Login Fail" });
      return res.json({ err: true,status:400, message: "Login Fail" });
    }
    //compare pwd
    const psRes = bcrypt.compareSync(password, data.password);
    if (!psRes) {
      // compare fail
      // return res.status(400).json({ err: true, message: "Login Fail" });
      return res.json({ err: true,status:400, message: "Login Fail" });
    }

    // delete data.password;
    //createToken
    const _accessToken = await accessToken.createToken(data);
    if (_accessToken.err != null) {
      return res.status(400).json({ err: true, message: _accessToken.message });
    }

    const _refreshToken = await refreshToken.createToken(data);
    if (_refreshToken.err != null) {
      return res.status(400).json({ err: true, message: _refreshToken.message });
    }

    const _userId = await users.getInfo(email);

    res.status(200).json({
      status:200,
      userId: _userId.data[0],
      token: {
        accessToken: _accessToken.data,
        refreshToken: _refreshToken.data,
      },
      message: "LOGIN SUCCESSFULLY",
    });
  } catch (err: any) {
    console.log("[v1/login fail :" + err.message + "]");
    res.status(400).json({ err: true, message: err.message });
  }
});
router.post("/v1/user", async function (req: Request, res: Response) {
  try {
    const { email, password, display_name, guid } = req.body;
    // get current user for op user
    // const op_user = getCurrentUser(req.headers);
    const op_user = "";
    // handleStr func and handle req data
    const handleStr = (ele: any) =>
      typeof ele === "string" ? replace(/\s*/g, "")(ele) : ele;
    const _handleData = map(handleStr)(req.body);
    //check insert or update
    if (isNil(guid)) {
      //insert or existed

      //check empty
      if (isEmpty(email) || isEmpty(password) || isEmpty(display_name)) {
        return res
          .status(400)
          .json({ err: true, message: "Data Cannot Be Empty" });
      }

      //check undefined or null
      if (isNil(email) || isNil(password) || isNil(display_name)) {
        return res
          .status(400)
          .json({ err: true, message: "Data Cannot Be Undefined Or Null" });
      }
      const { data } = await users.getInfo(email);

      if (isEmpty(data)) {
        //insert user
        const _userInfo: any = await users.getInfo(); // get all users num to create user id
        const userID: string =
          "D" + (_userInfo.data.length + 1).toString().padStart(6, "0"); //D0000001

        const _insertRes = await users.insert({
          ..._handleData,
          id: userID,
          op_user,
        });
        res.send(_insertRes);
        // _insertRes.err != null
        //   ? res.status(400).json({ err: true, message: "Sign Up User Fail" })
        //   : res.status(200).json({ message: "Sign Up User Success" });
      } else {
        // user is existed
        res.status(400).json({ err: true, message: "Email Is Existed" });
      }
    } else {
      //update
      const _updateRes = await users.update({ ..._handleData, op_user });
      _updateRes.err != null
        ? res.status(400).json({ err: true, message: "Update User Data Fail" })
        : res.status(200).json({ message: "Update User Data Success" });
    }
  } catch (err: any) {
    console.log("===[post user err :", err + "]===");
    res.status(400).json({ err: true, message: err.message });
  }
});
router.post("/v1/refreshToken", async function (req: Request, res: Response) {
  try {
    if (!req.headers["authorization"]) {
      return res.status(400).json({ err: true, message: "No header" });
    }

    const token = JSON.parse(req.headers["authorization"]);
    const _verifyAccessToken = await accessToken.verifyToken(token);
    const _verifyRefreshToken = await refreshToken.verifyToken(token);

    if (!_verifyRefreshToken) {
      res.status(403).json({ err: true, message: "RefreshToken_FAIL" });
    } else {
      const _accessToken = await accessToken.createToken(_verifyAccessToken.data);
      const _refreshToken = await refreshToken.createToken(_verifyAccessToken.data);
      res.status(200).json({
        token: {
          accessToken: _accessToken,
          refreshToken: _refreshToken,
        },
      });
    }
  } catch (err: any) {
    console.log("[v1/refreshToken fail :" + err.message + "]");
    res.status(400).json({ err: true, message: err.message });
  }
});

router.get("/", (req: Request, res: Response) => {

  // var tb = require('../db/auth');
  // tb.findAll().then((data:any) => {
  //   console.log("All data:", JSON.stringify(data));// 用 JSON.stringify() 來格式化輸出
  // });
  // res.end(JSON.stringify({ message: "ok" }));
  res.json({ message: "ok3123" });
});
export default router;
