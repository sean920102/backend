// for DB model
import { Sequelize, Transaction, QueryTypes } from "sequelize";
import db from "../db/database";
import member from "../db/auth"
const tableUrl = "../db/";

function tablehandler(table:any){
  var retrunTable;
  switch(table){
    case "member":
      retrunTable = member;
    default:
      retrunTable=member;
      break;
  }
  return retrunTable;
}

const m_db = {
  /**
   * DB查詢
   * @param  {String} table 資料表名稱
   * @param  {JSON} qry 查詢條件
   * @param  {JSON} options Sequelize Options
   */
  query: async function (table: string, qry?: any, options?: I_qryinfoOption) {
    var _options = options == undefined ? {} : options;
    _options.where = qry;
    return await handlerBDRes(await tablehandler(table).findAll(_options));
  },

  /**
   * DB新增
   * @param  {String} table 資料表名稱
   * @param  {JSON} insertdata 新增資料
   */
  insert: async function (table: string, insertdata: any) {
    var tb = require(tableUrl + table);
    return await handlerBDRes(await tablehandler(table).create(insertdata));
  },

  /**
   * DB新增(t)
   * @param  {String} table 資料表名稱
   * @param  {JSON} insertdata 新增資料
   * @param  {Transaction} t DB Transaction
   */
  insertWithTx: async function (table: string, insertdata: any, t: Transaction) {
    return await handlerBDRes(await tablehandler(table).create(insertdata, { transaction: t }));
  },

  /**
   * DB更新
   * @param  {String} table 資料表名稱
   * @param  {JSON} updatedata 更新資料
   * @param  {JSON} where 更新條件
   */
  update: async function (table: string, updatedata: any, where: any) {
    return await handlerBDRes(await tablehandler(table).update(updatedata, { where: where }));
  },

  /**
   * DB更新(t)
   * @param  {String} table 資料表名稱
   * @param  {JSON} updatedata 更新資料
   * @param  {JSON} where 更新條件
   * @param  {Transaction} t DB Transaction
   */
  updateWithTx: async function (table: string, updatedata: any, where: any, t: Transaction) {
    var tb = require(tableUrl + table);
    return await handlerBDRes(await tb.update(updatedata, { where: where }, { transaction: t }));
  },

  /**
   * DB刪除
   * @param  {String} table 資料表名稱
   * @param  {JSON} where 刪除條件
   */
  delete: async function (table: string, where: any) {
    return await handlerBDRes(await tablehandler(table).destroy({ where: where }));
  },

  /**
   * DB刪除(t)
   * @param  {String} table 資料表名稱
   * @param  {JSON} where 刪除條件
   * @param  {Transaction} t DB Transaction
   */
  deleteWithTx: async function (table: string, where: any, t: Transaction) {
    var tb = require(tableUrl + table);
    return await handlerBDRes(await tb.destroy({ where: where }, { transaction: t }));
  },

  /**
   * Raw SQL 查詢
   * @param  {String} sql 查詢語法
   * @param  {JSON} replacements 替換資料
   */
  execSelectSQL: async function (sql: string, replacements: any) {
    return await handlerBDRes(
      await db.query(sql, {
        replacements: replacements,
        type: QueryTypes.SELECT,
      })
    );
  },

  // query_publiccode: function (qry, callback) {
  //     publiccode.findAll({
  //         where: qry,
  //         order: [
  //             ["code_seq1", "asc"]
  //         ]
  //     }).then(function (result:any) {
  //         callback(result);
  //     }).catch(function (err:any) {
  //         throw err
  //     })
  // },
};
export default m_db;
export interface I_qryinfoOption {
  order?: any;
  attributes?: any;
  limit?: any;
  group?: any;
  where?: any;
  table?: any;
}

async function handlerBDRes(data: any) {
  var _data = JSON.parse(JSON.stringify(data));
  return (await _data.err) != null ? { err: true, message: _data.err.message } : { data: _data };
}
