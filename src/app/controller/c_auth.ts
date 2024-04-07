import m_db from "../dao/m_db";

export const auth = {
  /**
   * Function description : 取得使用者資料
   * @param  {string} email 使用者查詢條件資料
   */
  getAccInfo: async function (email?: string) {
    try {
      let qry: { email?: string } = {};
      email != "" ? (qry.email = email) : null;

      return await m_db.query("auth", qry);
    } catch (err: any) {
      console.log("[getAccInfo fail :" + err.message + "]");
      return { err: true, message: err.message };
    }
  },
};