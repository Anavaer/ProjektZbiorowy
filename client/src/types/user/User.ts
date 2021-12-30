export interface User {
  id: number;
  companyName: string;
  nip: string;
  firstName: string;
  lastName: string;
  city: string;
  address: string;
  phoneNumber?: string;
  roles?: string[];
  email: string;
}