import express from "express";
import { requireJWT } from "../middlewares";
import auth from "./auth";
import comments from "./comments";
import issues from "./issues";
import labels from "./labels";
import milestones from "./milestones";
import users from "./users";

const router = express.Router();

router.get("/", (req, res, next) => {
  res.json({ message: "welcome!" });
});

router.use("/auth", auth);
router.use("/comments", requireJWT, comments);
router.use("/issues", requireJWT, issues);
router.use("/labels", requireJWT, labels);
router.use("/milestones", requireJWT, milestones);
router.use("/users", users);

export default router;
