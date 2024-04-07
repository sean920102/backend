import db from "../db/database";
import * as bcrypt from "bcrypt";
import m_db from "../dao/m_db";
import { Transaction } from "sequelize";
import { getToday } from "../../utils";

export const users = {
  /**
   * Function description : 取得使用者資料
   * @param  {string} email 使用者查詢條件資料
   */
  getInfo: async function (email?: string) {
    try {
      let qry: any = {};
      if (email != "" && email != undefined) qry.email = email;
      return await m_db.query("auth", qry);
    } catch (err: any) {
      console.log("[user/getInfo fail :" + err.message + "]");
      return { err: true, message: err.message };
    }
  },

  /**
   * Function description : 新增使用者資料(註冊)_Auth&user
   * @param  {JSON} userInfo 使用者查詢條件資料
   */
  insert: function (userInfo: any) {
    var rtn = db.transaction().then(function (t: Transaction) {
      // insert user email and password
      let _insertAuthPromise = new Promise((resolve, reject) => {
        insertAuthPromise(userInfo, t, resolve, reject);
      });

      // insert user info
      let _insertUsersPromise = new Promise((resolve, reject) => {
        insertUsersPromise(userInfo, t, resolve, reject);
      });

      return Promise.all([_insertAuthPromise, _insertUsersPromise])
        .then(
          (value) => {
            t.commit();
            console.log("===[新增成功]===");
            return { status:200,message: "新增成功" };
          },
          (resion) => {
            t.rollback();
            console.log("[insertUser Promise fail : 新增時發生錯誤 ]");
            return { err: true, message: "新增時發生錯誤" };
          }
        )
        .catch((err) => {
          console.log("[user/insert fail :" + err.message + "]");
          return { err: true, message: err.message };
        });
    });
    return rtn;
  },

  /**
   * Function description : 更新使用者資料_user
   * @param  {JSON} userInfo 使用者修改資料
   */
  update: async function (userInfo: any) {
    try {
      const { email, is_enabled, root, op_user } = userInfo;
      const where = {
        email: email,
      };
      const updateData = {
        is_enabled: is_enabled,
        root: root,
        op_user: op_user,
      };
      return await m_db.update("users", updateData, where);
    } catch (err: any) {
      console.log("[user/update fail :" + err.message + "]");
      return { err: true, message: err.message };
    }
  },
};

/**
 * Function description : 新增使用者資料(註冊)_Auth_Promise
 * @param  {JSON} userInfo 使用者查詢條件資料
 * @param  {Transaction} t DB Transaction
 * @param  resolve resolve
 * @param  reject reject
 */
async function insertAuthPromise(userInfo: I_userInfo, t: Transaction, resolve: any, reject: any) {
  try {
    // const { email, password, op_user } = userInfo;
    const { email, password } = userInfo;
    let passwordHash = bcrypt.hashSync(password || "", 10); // 將使用者輸入的密碼進行加密
    let insertData = {
      email: email,
      password: passwordHash,
      cr_date: getToday(),
      // op_user: op_user,
      is_enabled: true,
    };
    let _res: any = await m_db.insertWithTx("auth", insertData, t);
    _res.err != null ? (console.log("[user/insertAuthPromise fail :" + _res.err.message + "]"), reject()) : resolve();
  } catch (err: any) {
    console.log("[user/catch/insertAuthPromise fail :" + err.message + "]");
    reject();
  }
}

/**
 * Function description : 新增使用者資料(註冊)_User_Promise
 * @param  {JSON} userInfo 使用者查詢條件資料
 * @param  {Transaction} t DB Transaction
 * @param  resolve resolve
 * @param  reject reject
 */
async function insertUsersPromise(userInfo: I_userInfo, t: Transaction, resolve: any, reject: any) {
  try {
    const { id, email, display_name, root } = userInfo;
    // const { id, email, display_name, op_user, root } = userInfo;
    var insertData: I_userInfo = {
      id: id,
      email: email,
      display_name: display_name,
      cr_date: getToday(),
      // op_user: op_user,
      is_enabled: true,
      root: root,
    };

    let _res: any = await m_db.insertWithTx("users", insertData, t);
    _res.err != null ? (console.log("[user/insertUsersPromise fail :" + _res.err.message + "]"), reject()) : resolve();
  } catch (err: any) {
    console.log("[user/catch/insertUsersPromise fail :" + err.message + "]");
    reject();
  }
}

interface I_userInfo {
  id: string;
  email: string;
  password?: string;
  display_name: string;
  cr_date?: string;
  op_user?: string;
  is_enabled?: boolean;
  root?: any;
}
