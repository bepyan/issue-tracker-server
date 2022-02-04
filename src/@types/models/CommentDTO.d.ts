declare module "@types" {
  type CommentStatus = "initial" | "closed" | "reopen";

  interface CommentDTO {
    id: string;
    content: string;
    /**
     * status를 변경한 유저를 기입
     */
    author: string;
    status: CommentStatus;
  }

  interface CommentRequestDTO {
    content: string;
    status?: CommentStatus;
  }
}
