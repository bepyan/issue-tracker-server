import { UserDTO } from "@types";
import express, { response } from "express";
import { asyncErrorCatcher } from "../middlewares";
import { LabelService } from "../services";

const router = express.Router();

// 특정 유저의 라벨을 보여주는 api
router.get(
  "/",
  asyncErrorCatcher(async (req, res) => {
    const labelList = await LabelService.getAll();
    res.send(labelList);
  })
);

// 특정 라벨 정보 반환
router.get(
  "/:id",
  asyncErrorCatcher(async (req, res) => {
    const labelId = req.params.id;
    const label = await LabelService.getById(labelId);
    res.send(label);
  })
);

router.post(
  "/",
  asyncErrorCatcher(async (req, res) => {
    const userId = (req.user as UserDTO).id;
    const newLabel = req.body;
    // 중복 체크
    const userLabelList = await LabelService.getAll();
    if (userLabelList.filter(({ name }) => newLabel.name == name).length) {
      throw {
        message: "이미 존재하는 라벨입니다.",
      };
    }

    const result = await LabelService.post(userId, newLabel);
    res.send(result);
  })
);

router.patch(
  "/:labelId",
  asyncErrorCatcher(async (req, res) => {
    const { labelId } = req.params;
    const result = await LabelService.patch(labelId, req.body);
    res.send(result);
  })
);

router.delete(
  "/:labelId",
  asyncErrorCatcher(async (req, res) => {
    const { labelId } = req.params;
    await LabelService.delete(labelId);
    res.end();
  })
);

export default router;
