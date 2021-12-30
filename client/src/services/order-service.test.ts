import axios from "axios";
import { Order, OrderDTO } from "types";
import { OrderService } from "./order-service";

jest.mock("axios");

let mockAxios = axios as jest.Mocked<typeof axios>;
let orderService: OrderService = new OrderService({ token: "test-token" });


let mockData: any[] = [
  {
    "orderId": 15,
    "serviceDate": new Date("2022-01-06T12:15:07"),
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
      "phoneNumber": "",
      "email": ""
    }
  },
  {
    "orderId": 1,
    "serviceDate": new Date("2022-01-06T12:15:07"),
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
      "phoneNumber": "",
      "email": ""
    },
    "client": {
      "id": 1,
      "companyName": "Moja firma",
      "nip": "123213",
      "firstName": "Client",
      "lastName": "Clientowski",
      "city": "Radom",
      "address": "ul. Sienkiewicza 3",
      "phoneNumber": "",
      "email": ""
    }
  }
];


const testOrder = (order: Order): void => {
  expect(order.orderId).toBeGreaterThan(0);
  expect(order.orderId).toEqual(parseInt(order.orderId + ""));
  expect(order.serviceDate).toBeInstanceOf(Date);
  expect(order.city).not.toBeNull();
  expect(order.address).not.toBeNull();
  expect(order.area).toBeGreaterThanOrEqual(0);
  expect(order.totalPrice).toBeGreaterThanOrEqual(0);

  if (order.employee == null)
    expect(order.orderStatus).toStrictEqual({ orderStatusId: 1, description: "NEW" });

  if (order.orderStatus.orderStatusId != 1)
    expect(order.employee).not.toBeNull();

  expect(order.client).not.toBeNull();
  expect(order.servicePrices).not.toBeNull();
  expect(order.servicePrices.length).toBeGreaterThan(0);
}





describe("OrderServiceTest", () => {
  test("getOrders", async () => {
    mockAxios.get.mockResolvedValueOnce({
      data: mockData
    });

    let res: Order[] = await orderService.getOrders();

    expect(res.length).toEqual(2);
    res.forEach(x => testOrder(x));
  });
  


  test("getOrder", async () => {
    mockAxios.get.mockResolvedValueOnce({
      data: mockData[0]
    });

    testOrder(await orderService.getOrder(15));
  });




  test("assignOrder", async () => {
    mockAxios.put.mockResolvedValueOnce({
      status: 204
    });

    let res = await orderService.assignOrder(15, 2);

    expect(res.status).toEqual(204);
  });
  



  test("startOrder", async () => {
    mockAxios.put.mockResolvedValueOnce({
      status: 204
    });

    let res = await orderService.startOrder(15);

    expect(res.status).toEqual(204);
  });
  



  test("cancelOrder", async () => {
    mockAxios.put.mockResolvedValueOnce({
      status: 204
    });

    let res = await orderService.cancelOrder(15);

    expect(res.status).toEqual(204);
  });
  



  test("completeOrder", async () => {
    mockAxios.put.mockResolvedValueOnce({
      status: 204
    });

    let res = await orderService.cancelOrder(15);

    expect(res.status).toEqual(204);
  });
  



  test("createOrder", async () => {
    let newOrder: OrderDTO = {
      address: "test address",
      area: 12,
      city: "Test City",
      serviceDates: [
        "2022-01-01T00:00:00",
        "2022-02-03T13:00:00"
      ],
      servicePriceIds: [1,2,3]
    };

    mockAxios.post.mockResolvedValueOnce({
      status: 201
    });

    let res = await orderService.createOrder(newOrder);

    expect(res.status).toEqual(201);
  });
});