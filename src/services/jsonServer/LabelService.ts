import { LabelDTO, LabelRequestDTO } from "@types";
import { _axios } from "../AxiosService";
import { v4 as uuidv4 } from "uuid";

const baseUrl = "/labels";

export default class LabelService {
  static async getByUserId(userId: string) {
    const { data } = await _axios.get<LabelDTO[]>(
      `${baseUrl}?userId=${userId}`
    );
    return data;
  }

  static async getById(id: string) {
    const { data } = await _axios.get<LabelDTO>(`${baseUrl}/${id}`);
    return data;
  }

  static async post(userId: string, payload: LabelRequestDTO) {
    const newLabel = {
      ...payload,
      id: uuidv4(),
      userId,
    };
    const { data } = await _axios.post<LabelDTO>(baseUrl, newLabel);
    return data;
  }

  static async patch(id: string, payload: Partial<LabelRequestDTO>) {
    const { data } = await _axios.patch<LabelDTO>(`${baseUrl}/${id}`, payload);
    return data;
  }

  static async delete(id: string) {
    const { data } = await _axios.delete(`${baseUrl}/${id}`);
    return data;
  }
}
