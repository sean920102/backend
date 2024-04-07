import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config({ path: '.env.dev' });
// import { I_user, I_token } from "../types/token";

export interface I_user {
  guid: string;
  email: string;
  iat: number;
  exp: number;
}

export interface I_token {
  // exp: number;
  accessToken?: any;
  refreshToken?: any;
}


export const accessToken = {
  createToken: (user: I_user) => {
    try {
      if (process.env.jwtKey === undefined) {
        return { err: true, message: "jwtKey not set" };
      }
      const nowTime = new Date().setSeconds(new Date().getSeconds());

      let expiredAt = new Date();
      expiredAt.setSeconds(expiredAt.getSeconds() + Number(process.env.jwtExpiration));

      const accessPayload = {
        guid: user.guid,
        email: user.email,
        iat: nowTime,
        exp: expiredAt.getTime(),
      };

      return { data: jwt.sign(accessPayload, process.env.jwtKey) };
    } catch (err: any) {
      return { err: true, message: err.message };
    }
  },

  verifyToken: (token: string) => {
    try {
      if (process.env.jwtKey === undefined) {
        return { err: true, message: "jwtKey not set" };
      }

      let decoded_accessToken: any = jwt.verify(
        token,
        process.env.jwtKey,
        function (err: any, decoded: any) {
          if (err != null) {
            return { status: 401, err: true, message: "AccessToken_Is_Denied" };
          } else {
            return decoded;
          }
        }
      );

      if (decoded_accessToken.exp > new Date().getTime()) {
        return { data: decoded_accessToken };
      } else {
        return { status: 403, err: true, message: "AccessToken_Is_Expired" };
      }
    } catch (err: any) {
      return { err: true, message: err.message };
    }
  },
};

export const refreshToken = {
  createToken: (user: I_user) => {
    try {
      if (process.env.jwtKey === undefined) {
        return { err: true, message: "jwtKey not set" };
      }
      const nowTime = new Date().setSeconds(new Date().getSeconds());

      let expiredAt = new Date();
      expiredAt.setSeconds(expiredAt.getSeconds() + Number(process.env.jwtRefreshExpiration));

      const refreshTokenPayload = {
        guid: user.guid,
        iat: nowTime,
        exp: expiredAt.getTime(),
      };
      return { data: jwt.sign(refreshTokenPayload, process.env.jwtKey) };
    } catch (err: any) {
      return { err: true, message: err.message };
    }
  },
  verifyToken: (token: I_token) => {
    try {
      if (process.env.jwtKey === undefined) {
        return { err: true, message: "jwtKey not set" };
      }
      let decoded_refreshToken: any = jwt.verify(
        token.refreshToken,
        process.env.jwtKey,
        function (err: any, decoded: any) {
          if (err != null) {
            return { err: true, message: "RefreshToken_Is_Denied" };
          } else {
            return decoded;
          }
        }
      );

      if (decoded_refreshToken.exp > new Date().getTime()) {
        return { data: decoded_refreshToken };
      } else {
        return { err: true, message: "RefreshToken_Is_Expired" };
      }
    } catch (err: any) {
      return { err: true, message: err.message };
    }
  },
};
