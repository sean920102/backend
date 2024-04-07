import { accessToken } from "./app/middleware/token";

export const getCurrentUser = (reqHeaders: any) => {
  let TokenVerify: any = accessToken.verifyToken(JSON.parse(reqHeaders["authorization"]));
  return TokenVerify.data.email;
};

/**
 * 取得民國年yyyMMdd
 */
export const getToday = () => {
  let today = new Date();
  let yyy = (today.getFullYear() - 1911).toString().padStart(3, "0");
  let month = (today.getMonth() + 1).toString().padStart(1, "0");
  let day = today.getDate().toString().padStart(2, "0");
  return yyy + month + day;
};
