import { UserRole } from "./UserRole";

export interface User {
  id: number;
  companyName: string;
  nip: string;
  firstName: string;
  lastName: string;
  city: string;
  address: string;
  userRoles: UserRole[];
  email: string;
}