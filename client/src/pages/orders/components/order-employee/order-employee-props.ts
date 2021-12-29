import { User } from "types";

export interface OrderEmployeeProps {
  employee?: User;
  onChangeAssignment: () => void;
}