import { UserDTO } from "@types";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "s";
const JWT_ALGORITHM = "HS256";
const ACCESS_EXPIRES_TIME = "1d";
const REFRESH_EXPIRES_TIME = "14d";

export const JWTService = {
  sign: (user: UserDTO) => {
    return jwt.sign(user, JWT_SECRET, {
      algorithm: JWT_ALGORITHM,
      expiresIn: ACCESS_EXPIRES_TIME,
    });
  },
  verify: (token: string) => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as UserDTO;

      return {
        success: true,
        user: decoded,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message,
      };
    }
  },
  refresh: () => {
    return jwt.sign({}, JWT_SECRET, {
      algorithm: JWT_ALGORITHM,
      expiresIn: REFRESH_EXPIRES_TIME,
    });
  },
};
