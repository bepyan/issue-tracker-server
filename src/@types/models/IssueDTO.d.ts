declare module "@types" {
  type IssueStatus = "open" | "close";

  interface IssueJSON {
    id: string;
    num: number;
    title: string;
    milestone: string | null;
    comments: string[];
    labels: string[];
    assignees: string[];
    writer: string;
    status: IssueStatus;
    timestamp: string;
  }

  interface IssueDTO {
    id: string;
    num: number;
    title: string;
    comments: CommentDTO[];
    labels: LabelDTO[];
    assignees: UserDTO[];
    milestone?: MilestoneDTO;
    writer: UserDTO;
    status: IssueStatus;
    timestamp: string;
  }

  interface IssueRequestDTO {
    title: string;
    comment: string;
    labels: string[];
    assignees: string[];
    milestone?: string | null;
  }
}
