import { UserDTO, UserJSON } from "@types";
import { _axios } from "../AxiosService";

const baseURL = "/users";

export default class UserService {
  static async getById(id: string) {
    const { data } = await _axios.get<UserJSON>(`${baseURL}/${id}`);
    return data;
  }

  static async getUserName(id: string) {
    const { name } = await UserService.getById(id);
    return name;
  }

  static async login({ id, pw }: { id: string; pw: string }) {
    const user = await this.getById(id);
    if (!user) return undefined;

    const isPasswordCorrect = pw === user.pw;
    if (!isPasswordCorrect) return undefined;

    return user;
  }

  static async register(payload: UserDTO) {
    const { data } = await _axios.post<UserDTO>(baseURL, payload);
    return data;
  }

  static async withdrawal(id: string) {
    const { data } = await _axios.delete<void>(`${baseURL}/${id}`);
    return data;
  }
}
