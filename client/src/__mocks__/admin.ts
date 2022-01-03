import { ServicePrice, User } from "types";

export const mockUserList: User[] = [
  {
    "id": 1,
    "companyName": "Moja firma",
    "nip": "123213",
    "firstName": "Client",
    "lastName": "Clientowski",
    "city": "Radom",
    "address": "ul. Sienkiewicza 3",
    "phoneNumber": "111222333",
    "email": "cclientowski@gmail.com",
    "roles": ["Client"]
  },
  {
    "id": 2,
    "companyName": "Moja firma",
    "nip": "123213",
    "firstName": "Worker",
    "lastName": "Workerowski",
    "city": "Radom",
    "address": "ul. Sienkiewicza 3",
    "phoneNumber": "111222333",
    "email": "wworkerowski@gmail.com",
    "roles": ["Client", "Worker"]
  }
];

export const mockServicePriceList: ServicePrice[] = [
  { "id": 1, "description": "Dummy Service 03", "priceRatio": 0.75 },
  { "id": 2, "description": "Dummy Service 02", "priceRatio": 1.8 },
  { "id": 3, "description": "Dummy Service 01", "priceRatio": 2 }
];