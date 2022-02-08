import { CommentDTO, CommentRequestDTO } from "@types";
import { _axios } from "../AxiosService";

const baseURL = "/comments";

export default class CommentService {
  static async getById(id: string) {
    const { data } = await _axios.get<CommentDTO>(`${baseURL}/${id}`);

    return data;
  }

  static async post(id: string, author: string, comment: CommentRequestDTO) {
    const newComment = {
      id,
      status: "initial",
      author,
      timestamp: new Date().toUTCString(),
      ...comment,
    };

    const { data } = await _axios.post<CommentDTO>(`${baseURL}`, newComment);
    return data;
  }

  static async patch(id: string, payload: Partial<CommentRequestDTO>) {
    const { data } = await _axios.patch<CommentDTO>(
      `${baseURL}/${id}`,
      payload
    );
    return data;
  }

  static async delete(id: string) {
    const { data } = await _axios.delete(`${baseURL}/${id}`);
    return data;
  }
}
