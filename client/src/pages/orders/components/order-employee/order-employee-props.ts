import { User } from "types";

export interface OrderEmployeeProps {
  employee?: User;
  client?: User;
  onChangeAssignment: (worker?: User) => void;
}