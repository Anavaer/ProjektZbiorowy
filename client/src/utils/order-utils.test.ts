import { OrderStatusWidgetColorsOptions } from "pages/orders/components/order-status/order-status-widget-colors-props";
import { mockOrderItem } from "__mocks__/order";
import { OrderUtils } from "./order-utils";


describe('OrderUtils testing', () => {
  test("processOrderTest", () => {
    expect(mockOrderItem.serviceDate).toEqual(new Date(mockOrderItem.serviceDate));
    expect(mockOrderItem.totalPrice).toEqual(Math.floor(mockOrderItem.totalPrice * 100) / 100);
    expect(mockOrderItem.services.length).toBeGreaterThan(0);
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
        mockOrderItem.orderStatus = elem.status;
        expect(OrderUtils.isCompleted(mockOrderItem)).toBe(elem.completed);
      });
    });
});