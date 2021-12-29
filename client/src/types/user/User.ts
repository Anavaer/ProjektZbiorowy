import { UserRole } from "./UserRole";

export interface User {
  companyName: string;
  nip: string;
  firstName: string;
  lastName: string;
  city: string;
  address: string;
  userRoles: UserRole[];
  email: string;
}