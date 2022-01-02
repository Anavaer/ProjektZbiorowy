import { Order } from "types";
import { OrderUtils } from "utils/order-utils";

export const mockOrderList: Order[] = [
  {
    "orderId": 15,
    "serviceDate": "2022-01-06T12:15:07",
    "city": "Radom",
    "address": "test",
    "area": 12,
    "totalPrice": 45.6,
    "orderStatus": {
      "orderStatusId": 1,
      "description": "NEW"
    },
    "client": {
      "id": 1,
      "companyName": "Moja firma",
      "nip": "123213",
      "firstName": "Client",
      "lastName": "Clientowski",
      "city": "Radom",
      "address": "ul. Sienkiewicza 3",
      "phoneNumber": "111222333",
      "email": "cclientowski@gmail.com"
    }
  },
  {
    "orderId": 1,
    "serviceDate": "2022-01-06T12:15:07",
    "city": "string xD",
    "address": "string xD",
    "area": 24,
    "totalPrice": 195,
    "orderStatus": {
      "orderStatusId": 4,
      "description": "COMPLETED"
    },
    "employee": {
      "id": 2,
      "firstName": "Worker",
      "lastName": "Workerowski",
      "phoneNumber": "111222333",
      "email": "wWorkerowski"
    },
    "client": {
      "id": 1,
      "companyName": "Moja firma",
      "nip": "123213",
      "firstName": "Client",
      "lastName": "Clientowski",
      "city": "Radom",
      "address": "ul. Sienkiewicza 3",
      "phoneNumber": "111222333",
      "email": "cclientowski@gmail.com"
    }
  }
].map(order => OrderUtils.processOrder(order));





export const mockOrderItem: Order = OrderUtils.processOrder({
  "orderId": 15,
  "serviceDate": "2022-01-06T12:15:07",
  "city": "Radom",
  "address": "test",
  "area": 12,
  "totalPrice": 45.6,
  "orderStatus": {
    "orderStatusId": 1,
    "description": "NEW"
  },
  "client": {
    "id": 1,
    "companyName": "Moja firma",
    "nip": "123213",
    "firstName": "Client",
    "lastName": "Clientowski",
    "city": "Radom",
    "address": "ul. Sienkiewicza 3",
    "phoneNumber": "111222333",
    "email": "cclientowski@gmail.com"
  }
});