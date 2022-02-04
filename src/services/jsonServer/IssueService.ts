import {
  IssueDTO,
  IssueJSON,
  IssueRequestDTO,
  UserDTO,
  CommentRequestDTO,
} from "@types";
import { _axios } from "../AxiosService";
import UserService from "./UserService";
import CommentService from "./CommentService";
import LabelService from "./LabelService";
import MilestoneService from "./MilestoneService";
import { v4 as uuidv4 } from "uuid";

const baseUrl = "/issues";

class IssueService {
  static async transfer(json: IssueJSON): Promise<IssueDTO> {
    const [writer, assignees, comments, labels, milestone] = await Promise.all([
      UserService.getById(json.writer),
      Promise.all(json.assignees.map(UserService.getById)),
      Promise.all(json.comments.map(CommentService.getById)),
      Promise.all(json.labels.map(LabelService.getById)),
      json.milestone ? MilestoneService.getById(json.milestone) : undefined,
    ]);

    return {
      ...json,
      writer,
      assignees,
      milestone,
      labels,
      comments,
    };
  }

  // GET

  static async getAll() {
    const { data } = await _axios.get<IssueJSON[]>(baseUrl);

    return await Promise.all(data.map(this.transfer));
  }

  static async getUserIssue(userId: string) {
    const { data } = await _axios.get<IssueJSON[]>(
      `${baseUrl}?writer=${userId}`
    );

    return await Promise.all(data.map(this.transfer));
  }

  static async getMilestoneIssueJSON(milestoneId: string) {
    const { data } = await _axios.get<IssueJSON[]>(
      `${baseUrl}?milestone=${milestoneId}`
    );
    return data;
  }

  static async getByIdJSON(id: string) {
    const { data } = await _axios.get<IssueJSON>(`${baseUrl}/${id}`);
    return data;
  }

  static async getById(id: string) {
    return this.transfer(await this.getByIdJSON(id));
  }

  //  POST
  static async post(userId: string, payload: IssueRequestDTO) {
    const { data: issueList } = await _axios.get<IssueJSON[]>(
      `${baseUrl}?writer=${userId}`
    );

    const nextNum = issueList.length + 1;
    const issueId = uuidv4();
    const commentId = uuidv4();
    const milestoneId = payload.milestone;

    const newIssue: IssueJSON = {
      id: issueId,
      num: nextNum,
      status: "open",
      writer: userId,
      timestamp: new Date().toUTCString(),
      title: payload.title,
      assignees: payload.assignees,
      labels: payload.labels,
      comments: [commentId],
      milestone: milestoneId || null,
    };

    const [_, __, { data }] = await Promise.all([
      CommentService.post(commentId, userId, {
        content: payload.comment || "No description provided.",
      }),
      milestoneId && MilestoneService.patchAddIssue(milestoneId, issueId),
      _axios.post<IssueDTO>(baseUrl, newIssue),
    ]);

    return data;
  }

  // patch
  static async patch(issueId: string, payload: Partial<IssueRequestDTO>) {
    const { data } = await _axios.patch<IssueDTO>(
      `${baseUrl}/${issueId}`,
      payload
    );
    return data;
  }

  static async patchChangeState({
    issueId,
    userId,
  }: {
    issueId: string;
    userId: string;
  }) {
    const { status } = await this.getByIdJSON(issueId);
    const IssueStatus = status === "open" ? "close" : "open";
    const commentStatus = status === "open" ? "closed" : "reopen";
    const comemntContent =
      status === "open" ? "이슈가 닫혔습니다." : "이슈가 다시 열렸습니다.";

    const comment: CommentRequestDTO = {
      status: commentStatus,
      content: comemntContent,
    };

    const [_, data] = await Promise.all([
      _axios.patch<IssueDTO>(`${baseUrl}/${issueId}`, {
        status: IssueStatus,
      }),
      IssueService.patchAddComment({ issueId, userId, comment }),
    ]);

    return data;
  }

  static async patchAddComment({
    issueId,
    userId,
    comment,
  }: {
    issueId: string;
    userId: string;
    comment: CommentRequestDTO;
  }) {
    const issueIdList = await this.getByIdJSON(issueId);

    const id = uuidv4();
    const [{ data }] = await Promise.all([
      _axios.patch<IssueDTO>(`${baseUrl}/${issueId}`, {
        comments: [...issueIdList.comments, id],
      }),
      CommentService.post(id, userId, comment),
    ]);
    return data;
  }

  static async patchDeleteComment({
    issueId,
    commentId,
  }: {
    issueId: string;
    commentId: string;
  }) {
    const issue = await this.getByIdJSON(issueId);

    const [{ data }] = await Promise.all([
      _axios.patch<IssueDTO>(`${baseUrl}/${issueId}`, {
        comments: issue.comments.filter((id) => id !== commentId),
      }),
      CommentService.delete(commentId),
    ]);
    return data;
  }

  static async patchDeleteMilestone({
    issueId,
    milestoneId,
  }: {
    issueId: string;
    milestoneId: string;
  }) {
    const issueJSONList = await this.getMilestoneIssueJSON(issueId);

    Promise.all(
      issueJSONList
        .filter((v) => v.milestone === milestoneId)
        .map(() =>
          _axios.patch(`${baseUrl}/${issueId}`, {
            milestone: null,
          })
        )
    );
  }

  // DELETE
  static async delete(issueId: string) {
    const issue = await this.getByIdJSON(issueId);

    await Promise.all([
      issue.comments.map(CommentService.delete),
      issue.milestone &&
        MilestoneService.patchRemoveIssue(issue.id, issue.milestone),
      _axios.delete(`${baseUrl}/${issueId}`),
    ]);
  }
}

export default IssueService;
