declare module "@types" {
  interface LabelDTO {
    id: string;
    name: string;
    description: string;
    color: "light" | "dark";
    backgroundColor: string;
    userId: string;
  }

  interface LabelRequestDTO {
    name: string;
    description: string;
    color: "light" | "dark";
    backgroundColor: string;
  }
}
