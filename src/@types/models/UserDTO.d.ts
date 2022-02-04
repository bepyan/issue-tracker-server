declare module "@types" {
  interface UserJSON {
    id: string;
    pw: string;
    name: string;
  }

  interface UserDTO {
    id: string;
    name: string;
  }

  interface UserLoginDTO {
    id: string;
    pw: string;
  }
}
