import { RequestHandler } from "express";
import passport from "passport";
// import { JWTService } from "../services";

// export const authJWT: RequestHandler = (req, res, next) => {
//   if (!req.headers.authorization || !req.headers.refresh) {
//     res.status(400).send({
//       success: false,
//       message: "Access token and refresh token are need for refresh!",
//     });
//     return;
//   }

//   const accessToken = req.headers.authorization.split("bearer ")[1];
//   const result = JWTService.verify(accessToken);

//   if (!result.success) {
//     res.status(401).send({
//       message: result.message, // jwt가 만료되었다면 메세지는 'jwt expired'입니다.
//     });
//     return;
//   }
//   next();
// };

export const requireJWT: RequestHandler = (req, res, next) =>
  passport.authenticate("jwt", { session: false }, (error, user) => {
    if (!user) {
      throw {
        status: 401,
        message: "No auth",
      };
    }

    req.user = {
      id: user.id,
      name: user.name,
    };
    next();
  })(req, res, next);
