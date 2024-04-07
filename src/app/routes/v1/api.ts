import { Request, Response, NextFunction } from "express";
import express from "express";
import { accessToken} from "../../middleware/token";
import { users } from "../../controller/c_users";
import tb from "../../db/auth";

var router = express.Router();
router.all("/*", async function (req: Request, res: Response, next: NextFunction) {
  try {
      const bearerHeader = req.headers.authorization;
      console.log(bearerHeader);
      if(bearerHeader!=undefined){
        console.log(req.headers["authorization"]);
        console.log(typeof req.headers["authorization"]);
        if (typeof bearerHeader !== "undefined") {
          let __token = bearerHeader.split(" ");
          // let token = JSON.parse(__token[1] || "{}");
          let token = __token[1] || "";
          //check token
          if (!token || token == "") {
            res.status(403).json({ err: true, message: "No token provided!" });
          }
          var TokenVerify = await accessToken.verifyToken(token);
          if (TokenVerify.err) {
            res
              // .status(TokenVerify.status || 400)
              .json({ status:TokenVerify.status,err: true, message: TokenVerify.message });
          } else {
            next();
          }
        }
      }
      else{
        // next();
        res.status(400).json({ err: true, message: "No login!!"});
        res.end();
      }
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

router.get("/user", async function (req, res) {
  try {
    const { email } = req.query;
    const _userInfo = await users.getInfo(<string>email || "");
    _userInfo.err != null
      ? res.status(400).json({ ..._userInfo })
      : res.status(200).json({ ..._userInfo });
  } catch (err: any) {
    console.log("===[get user err :", err + "]===");
    res.status(400).json({ err: true, message: err.message });
  }
});

export default router;