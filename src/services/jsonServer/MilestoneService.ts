import { MilestoneDTO, MilestoneJSON, MilestoneRequestDTO } from "@types";
import { _axios } from "../AxiosService";
import IssueService from "./IssueService";
import { v4 as uuidv4 } from "uuid";

const baseURL = "/milestones";

export default class MilestoneService {
  static async transfer(json: MilestoneJSON): Promise<MilestoneDTO> {
    const issues = await Promise.all(json.issues.map(IssueService.getByIdJSON));

    return { ...json, issues };
  }

  static async getAll() {
    const { data } = await _axios.get<MilestoneJSON[]>(`${baseURL}`);
    return await Promise.all(data.map(this.transfer));
  }

  static async getByIdJSON(id: string) {
    const { data } = await _axios.get<MilestoneJSON>(`${baseURL}/${id}`);
    return data;
  }

  static async getById(id: string) {
    return this.transfer(await this.getByIdJSON(id));
  }

  static async post(payload: MilestoneRequestDTO) {
    const newMilestone = {
      ...payload,
      id: uuidv4(),
      status: "open",
      issues: [],
    };
    const { data } = await _axios.post<MilestoneDTO>(baseURL, newMilestone);
    return data;
  }

  // 마일스톤 수정
  static async patch(id: string, payload: Partial<MilestoneRequestDTO>) {
    const { data } = await _axios.patch<MilestoneDTO>(
      `${baseURL}/${id}`,
      payload
    );
    return data;
  }

  static async patchAddIssue(id: string, issueId: string) {
    const [milestone, newIssue] = await Promise.all([
      this.getByIdJSON(id),
      IssueService.getByIdJSON(issueId),
    ]);

    const { data } = await _axios.patch<MilestoneJSON>(`${baseURL}/${id}`, {
      issues: [...milestone.issues, newIssue.id],
    });
    return data;
  }

  static async patchRemoveIssue(id: string, issueId: string) {
    const milestone = await this.getByIdJSON(id);

    const { data } = await _axios.patch<MilestoneDTO>(`${baseURL}/${id}`, {
      issues: milestone.issues.filter((id) => id !== issueId),
    });
    return data;
  }

  static async delete(id: string) {
    const milestone = await this.getByIdJSON(id);

    await Promise.all([
      _axios.delete(`${baseURL}/${id}`),
      milestone.issues.map((issueId) =>
        IssueService.patch(issueId, { milestone: null })
      ),
    ]);
  }
}
