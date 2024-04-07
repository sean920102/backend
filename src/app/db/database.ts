import { Sequelize, Options } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.dev' });

var omitNull_TorF
if (process.env.CONN_omitNull === 'false') {
    omitNull_TorF = false
} else {
    omitNull_TorF = true
}

// const CONN_DATABASE = process.env.CONN_DATABASE || "shopping";
// const CONN_USERNAME = process.env.CONN_USERNAME || "postgres";
// const CONN_PASSWORD = process.env.CONN_PASSWORD || "good1234";
const CONN_DATABASE = process.env.CONN_DATABASE || "shopping";
const CONN_USERNAME = process.env.CONN_USERNAME || "postgres";
const CONN_PASSWORD = process.env.CONN_PASSWORD || "good1234";
const CONN_DIALECT = process.env.CONN_DIALECT || "postgres";

// const CONN_OPTION = {
//   host: process.env.DB_HOST || "127.0.0.1",
//   port: Number(process.env.DB_PORT),
//   dialect: CONN_DIALECT,
//   logging: false,
//   omitNull: omitNull_TorF,
//   timezone: "+08:00",
//   pool: {
//       max: 20,
//       min: 0,
//       idle: 10000
//   }
// };

const CONN_OPTION: Options = {
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT),
  dialect: 'mysql', // 这里可以是 'mysql'、'postgres'、'sqlite' 或 'mssql' 之一
  logging: false, // 是否打印 SQL 日志
  omitNull: true, // 是否忽略值为 null 的属性
  timezone: '+08:00', // 时区
  pool: {
    max: 5, // 连接池中最大连接数
    min: 0, // 连接池中最小连接数
    idle: 10000 // 连接池空闲时的超时时间（毫秒）
  }
};


var dbStorage = new Sequelize(
  CONN_DATABASE,
  CONN_USERNAME,
  CONN_PASSWORD,
  CONN_OPTION);

  dbStorage.sync()
  .then(() => {
    console.log('数据库连接成功');
  })
  .catch(err => {
    console.error('数据库连接失败:', err);
  });

export default dbStorage;