import express from "express";
import { MilestoneDTO, MilestoneRequestDTO } from "@types";
import { MilestoneService } from "../services";
import { asyncErrorCatcher } from "../middlewares";

const router = express.Router();

router.get(
  "/",
  asyncErrorCatcher(async (req, res) => {
    const milestoneList = await MilestoneService.getAll();
    res.send(milestoneList);
  })
);

router.get(
  "/:id",
  asyncErrorCatcher(async (req, res) => {
    const milestoneId = req.params.id;
    const milestone = await MilestoneService.getById(milestoneId);
    res.send(milestone);
  })
);

router.post(
  "/",
  asyncErrorCatcher(async (req, res) => {
    const milestone = req.body as MilestoneRequestDTO;

    // 중복 체크 진행
    const milestoneList = await MilestoneService.getAll();
    const hasSameTitle = milestoneList.some((e) => milestone.title === e.title);
    if (hasSameTitle) {
      throw {
        status: 400,
        message: "동일한 이름의 마일스톤이 존재합니다.",
      };
    }

    const result = await MilestoneService.post(milestone);
    res.send(result);
  })
);

router.patch(
  "/:id",
  asyncErrorCatcher(async (req, res) => {
    const { id } = req.params;
    const payload = req.body as MilestoneDTO;

    const newMilestone = await MilestoneService.patch(id, payload);
    res.send(newMilestone);
  })
);

router.delete(
  "/:id",
  asyncErrorCatcher(async (req, res) => {
    const { id } = req.params;

    await MilestoneService.delete(id);
    res.end();
  })
);

export default router;
