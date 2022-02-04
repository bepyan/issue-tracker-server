import { UserDTO } from "@types";
import express from "express";
import passport from "passport";
import { requireJWT } from "../middlewares";
import { JWTService, UserService } from "../services";

const router = express.Router();

router.get("/account", requireJWT, (req, res) => {
  const user = req.user as UserDTO;

  res.status(200).send(user);
});

// github login
router.get("/github", passport.authenticate("github", { session: false }));

// github redirect url
router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/login",
    session: false,
  }),
  async (req, res) => {
    const user = req.user as UserDTO;

    const accessToken = JWTService.sign(user);

    const isNew = !(await UserService.getById(user.id));
    if (isNew) await UserService.register(user);

    res
      .status(301)
      .redirect(
        "http://localhost:3000/auth/callback" + `?accessToken=${accessToken}`
      );
  }
);

export default router;
