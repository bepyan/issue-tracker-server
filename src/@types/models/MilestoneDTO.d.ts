declare module "@types" {
  type MilestoneStatus = "open" | "closed";

  interface MilestoneJSON {
    id: string;
    title: string;
    description: string;
    deadline: string;
    issues: string[];
    status: MilestoneStatus;
  }

  interface MilestoneDTO {
    id: string;
    title: string;
    description: string;
    deadline: string;
    issues: IssueJSON[];
    status: MilestoneStatus;
  }

  interface MilestoneRequestDTO {
    title: string;
    description: string;
    deadline: string;
  }
}
