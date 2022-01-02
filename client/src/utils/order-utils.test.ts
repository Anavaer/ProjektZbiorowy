import { OrderStatusWidgetColorsOptions } from "pages/orders/components/order-status/order-status-widget-colors-props";
import { Order } from "types";
import { OrderUtils } from "./order-utils";

let input: any = {
  "orderId": 1,
  "serviceDate": "2021-12-21T00:00:00",
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
    "phoneNumber": null,
    "email": null
  },
  "client": {
    "id": 1,
    "companyName": "Moja firma",
    "nip": "123213",
    "firstName": "Client",
    "lastName": "Clientowski",
    "city": "Radom",
    "address": "ul. Sienkiewicza 3",
    "phoneNumber": null,
    "email": null
  }
};
let parsedOrder: Order = OrderUtils.processOrder(input);


describe('OrderUtils testing', () => {
  test("processOrderTest", () => {
    expect(parsedOrder.serviceDate).toEqual(new Date(input.serviceDate));
    expect(parsedOrder.totalPrice).toEqual(Math.floor(input.totalPrice * 100) / 100);
    expect(parsedOrder.services.length).toBeGreaterThan(0);
  });




  [
    { name: "NEW", color: "white" },
    { name: "CONFIRMED", color: "black" },
    { name: "ONGOING", color: "white" },
    { name: "COMPLETED", color: "white" },
    { name: "CANCELED", color: "white" }
  ]
    .forEach(status => {
      test(`getOrderStatusColorTest :: run tests for status ${status.name}`, () => {
        let res: OrderStatusWidgetColorsOptions = OrderUtils.getOrderStatusColor(status.name);
        expect(/^\#[0-9a-f]{3,6}/g.test(res.background)).toBeTruthy();
        expect(/^\#[0-9a-f]{3,6}/g.test(res.backgroundDark)).toBeTruthy();
        expect(res.color).toBe(status.color);
      });
    });



  [
    {
      status: { "orderStatusId": 1, "description": "NEW" },
      completed: false
    },
    {
      status: { "orderStatusId": 2, "description": "CONFIRMED" },
      completed: false
    },
    {
      status: { "orderStatusId": 3, "description": "ONGOING" },
      completed: false
    },
    {
      status: { "orderStatusId": 4, "description": "COMPLETED" },
      completed: true
    },
    {
      status: { "orderStatusId": 5, "description": "CANCELED" },
      completed: true
    }
  ]
    .forEach(elem => {
      test(`isCompletedTest :: for status "${elem.status.description}" completed should be "${elem.status}"`, () => {
        parsedOrder.orderStatus = elem.status;
        expect(OrderUtils.isCompleted(parsedOrder)).toBe(elem.completed);
      });
    });
});