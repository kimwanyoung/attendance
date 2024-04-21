import { Status } from "../const/status.const";

export class ApprovalDto {
  userId: number;
  groupId: number;
  status: Status;
}
