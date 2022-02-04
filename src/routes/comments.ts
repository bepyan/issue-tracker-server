import { UserDTO } from "@types";
import express from "express";
import { asyncErrorCatcher } from "../middlewares";
import { CommentService } from "../services";

const router = express.Router();

router.patch(
  "/:commentId",
  asyncErrorCatcher(async (req, res) => {
    const { commentId } = req.params;

    const result = await CommentService.patch(commentId, req.body);

    res.status(200).json({ result });
  })
);

export default router;
