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
    failureRedirect: `${process.env.FRONTEND_URL}`,
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
        `${process.env.FRONTEND_URL}/auth/callback?accessToken=${accessToken}`
      );
  }
);

export default router;
