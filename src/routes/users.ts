import { UserDTO, UserJSON, UserLoginDTO } from "@types";
import express from "express";
import { asyncErrorCatcher, requireJWT } from "../middlewares";
import { JWTService, UserService } from "../services";

const router = express.Router();

router.get(
  "/",
  requireJWT,
  asyncErrorCatcher(async (req, res) => {
    const userJSONList = await UserService.getAllUser();

    const userList: UserDTO[] = userJSONList.map((v) => ({
      id: v.id,
      name: v.name,
    }));
    res.send(userList);
  })
);

router.post(
  "/login",
  asyncErrorCatcher(async (req, res) => {
    const data: UserLoginDTO = req.body;
    const user = await UserService.login(data);

    if (!user) {
      throw {
        status: 401,
        message: "아이디 혹은 비밀번호를 확인해주세요.",
      };
    }

    const accessToken = JWTService.sign({
      id: user.id,
      name: user.name,
    });
    const refreshToken = JWTService.refresh();

    // TODO: refresh토큰 DB에 저장

    res.status(200).json({
      user,
      accessToken,
      refreshToken,
    });
  })
);

router.post(
  "/register",
  asyncErrorCatcher(async (req, res) => {
    const user = req.body as UserJSON;
    if (!user.id || !user.name || !user.pw) {
      res.status(400).json({ message: "유효하지 않은 요청입니다." });
      return;
    }
    const isDuplicated = !!(await UserService.getById(user.id));
    if (isDuplicated) {
      res.status(400).json({ message: "중복된 아이디가 있습니다." });
      return;
    }

    const data = await UserService.register(user);

    const accessToken = JWTService.sign(user);
    const refreshToken = JWTService.refresh();

    res.json({
      accessToken,
      refreshToken,
      user: data,
    });
  })
);

router.delete(
  "/withdrawal",
  requireJWT,
  asyncErrorCatcher(async (req, res) => {
    const user = req.user as UserDTO;

    await UserService.withdrawal(user.id);
    res.end();
  })
);

export default router;
