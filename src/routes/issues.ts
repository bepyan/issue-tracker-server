import { CommentRequestDTO, IssueRequestDTO, UserDTO } from "@types";
import express from "express";
import { asyncErrorCatcher } from "../middlewares";
import { IssueService, CommentService } from "../services";

const router = express.Router();

// GET

router.get(
  "/",
  asyncErrorCatcher(async (req, res) => {
    const issueList = await IssueService.getAll();
    res.send(issueList);
  })
);

router.get(
  "/:issueId",
  asyncErrorCatcher(async (req, res) => {
    const { issueId } = req.params;

    const issue = await IssueService.getById(issueId);
    res.send(issue);
  })
);

// POST

router.post(
  "/",
  asyncErrorCatcher(async (req, res) => {
    const user = req.user as UserDTO;
    const issue = req.body as IssueRequestDTO;

    const newIssue = await IssueService.post(user.id, issue);
    res.send(newIssue);
  })
);

router.post(
  "/:issueId/comment",
  asyncErrorCatcher(async (req, res) => {
    const userId = (req.user as UserDTO).id;
    const { issueId } = req.params;
    const comment = req.body as CommentRequestDTO;

    const newIssue = await IssueService.patchAddComment({
      issueId,
      userId,
      comment,
    });
    res.send(newIssue);
  })
);

// PATCH

router.patch(
  "/:issueId",
  asyncErrorCatcher(async (req, res) => {
    const { issueId } = req.params;
    const payload = req.body as IssueRequestDTO;

    const newIssue = await IssueService.patch(issueId, payload);
    res.send(newIssue);
  })
);

router.patch(
  "/:issueId/status",
  asyncErrorCatcher(async (req, res) => {
    const userId = (req.user as UserDTO).id;
    const { issueId } = req.params;
    const { status } = req.body;

    const newIssue = await IssueService.patchChangeState({
      userId,
      issueId,
      status,
    });
    res.send(newIssue);
  })
);

// DELETE

router.delete(
  "/:issueId",
  asyncErrorCatcher(async (req, res) => {
    const user = req.user as UserDTO;
    const { issueId } = req.params;

    const issue = await IssueService.getByIdJSON(issueId);

    if (issue.writer !== user.id) {
      throw {
        status: 401,
        message: "삭제 권한이 없습니다.",
      };
    }

    await IssueService.delete(issueId);
    res.end();
  })
);

router.delete(
  "/:issueId/comment/:commentId",
  asyncErrorCatcher(async (req, res) => {
    const userId = (req.user as UserDTO).id;
    const { issueId, commentId } = req.params;

    const comment = await CommentService.getById(commentId);

    if (comment.author !== userId) {
      throw {
        status: 401,
        message: "삭제 권한이 없습니다.",
      };
    }

    await IssueService.patchDeleteComment({ issueId, commentId });
    res.end();
  })
);

export default router;
