import axios from "axios";
import { Order, OrderDTO } from "types";
import { mockOrderItem, mockOrderList } from "__mocks__/order";
import { OrderService } from "./order-service";

jest.mock("axios");

let mockAxios = axios as jest.Mocked<typeof axios>;
let orderService: OrderService = new OrderService({ token: "test-token" });



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
  expect(order.services).not.toBeNull();
  expect(order.services.length).toBeGreaterThan(0);
}





describe("OrderServiceTest", () => {

  beforeEach(() => {
    mockAxios.get.mockImplementation(url => {
      switch(url) {
        case "/api/orders":
          return Promise.resolve({ data: mockOrderList });
        case "/api/orders/" + mockOrderItem.orderId:
          return Promise.resolve({ data: mockOrderItem });
        default:
          return Promise.reject(new Error("Unexpected"));
      }
    });
    
    mockAxios.put.mockResolvedValueOnce({
      status: 204
    });

    mockAxios.post.mockResolvedValueOnce({
      status: 201
    });
  });

  afterEach(() => {
    mockAxios.put.mockClear();
  });



  test("getOrders", async () => {
    let res: Order[] = await orderService.getOrders();

    expect(res.length).toEqual(2);
    res.forEach(x => testOrder(x));
  });

  test("getOrder", async () => testOrder(await orderService.getOrder(15)));

  test("assignOrder", async () => expect(await orderService.assignOrder(15, 2)).toStrictEqual({ status: 204 }));
  
  test("startOrder", async () => expect(await orderService.startOrder(15)).toStrictEqual({ status: 204 }));
  
  test("cancelOrder", async () => expect(await orderService.cancelOrder(15)).toStrictEqual({ status: 204 }));
  
  test("completeOrder", async () => expect(await orderService.cancelOrder(15)).toStrictEqual({ status: 204 }));

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

    let res = await orderService.createOrder(newOrder);

    expect(res.status).toEqual(201);
  });
});