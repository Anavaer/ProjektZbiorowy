import { fireEvent, render, screen } from "@testing-library/react";
import axios from "axios";
import * as React from 'react';
import { Order } from "types";
import { OrderUtils } from "utils/order-utils";
import { mockUserList } from "__mocks__/admin";
import { mockOrderItem } from "__mocks__/order";
import { mockOrderStatusList } from "__mocks__/order-status";
import { OrderStatusWidget } from "./order-status-widget";
import { OrderStatusStateChangeCallbackBuilder } from "./OrderStatusStateChangeCallbackBuilder";


jest.mock("axios");

let orderStatusStateChangeCallbackBuilder = new OrderStatusStateChangeCallbackBuilder();

let mockAxios = axios as jest.Mocked<typeof axios>;




describe("OrderStatusWidgetTest", () => {

  beforeEach(() => {
    document.body.innerHTML = "";
    mockAxios.get.mockResolvedValueOnce({
      data: mockOrderStatusList
    });
  });

  afterEach(() => {
    mockAxios.get.mockClear();
  });

  
  test("Should render order status widget correctly", async () => {
    render(<OrderStatusWidget order={mockOrderItem} callbackBuilder={orderStatusStateChangeCallbackBuilder} />);
    const orderStatusWidget = await screen.findByRole("order-status-widget");
    const orderStatusWidgetButton = await screen.findByRole("order-status-widget-button");

    const colors = OrderUtils.getOrderStatusColor(mockOrderItem.orderStatus.description);

    expect(orderStatusWidget).toBeInTheDocument();
    expect(orderStatusWidgetButton).toHaveTextContent(mockOrderItem.orderStatus.visibleText!);
    expect(orderStatusWidgetButton).not.toBeDisabled();
    expect(orderStatusWidgetButton).toHaveStyle({
      backgroundColor: colors.background,
      color: colors.color
    });
  });


  test("For not completed order, button should open menu", async () => {
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: `token=test-token; id=${mockOrderItem.client.id}; role=["Client", "Worker"]`
    });

    let processedOrder: Order = Object.assign({}, mockOrderItem);
    processedOrder.orderStatus = OrderUtils.processOrderStatus({ "orderStatusId": 1, "description": "NEW" });
    processedOrder.employee = mockUserList[0];

    render(<OrderStatusWidget order={processedOrder} callbackBuilder={orderStatusStateChangeCallbackBuilder} />);
    const orderStatusWidgetButton = await screen.findByRole("order-status-widget-button");

    fireEvent.click(orderStatusWidgetButton);

    const orderStatusWidgetMenu = await screen.findByRole("order-status-widget-menu");
    expect(orderStatusWidgetMenu).toBeInTheDocument();
  });


  test("For completed order, button should not open menu", async () => {
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: `token=test-token; id=${mockOrderItem.client.id}; role=["Client", "Worker"]`
    });

    let processedOrder: Order = Object.assign({}, mockOrderItem);
    processedOrder.orderStatus = OrderUtils.processOrderStatus({ "orderStatusId": 4, "description": "COMPLETED" });
    processedOrder.employee = mockUserList[0];

    render(<OrderStatusWidget order={processedOrder} callbackBuilder={orderStatusStateChangeCallbackBuilder} />);
    const orderStatusWidgetButton = await screen.findByRole("order-status-widget-button");

    fireEvent.click(orderStatusWidgetButton);

    const orderStatusWidgetMenu = await screen.queryByRole("order-status-widget-menu");
    expect(orderStatusWidgetMenu).toBeNull();
  });
  


  
  [
    // Logged user is a client
    {
      status: { "orderStatusId": 1, "description": "NEW" },
      userId: mockOrderItem.client.id,
      employee: null,
      roles: ["Client"],
      fields: [
        { "orderStatusId": 5, "description": "CANCELED" }
      ]
    },
    {
      status: { "orderStatusId": 2, "description": "CONFIRMED" },
      userId: mockOrderItem.client.id,
      employee: mockUserList[0],
      roles: ["Client"],
      fields: [
        { "orderStatusId": 5, "description": "CANCELED" }
      ]
    },
    {
      status: { "orderStatusId": 3, "description": "ONGOING" },
      userId: mockOrderItem.client.id,
      employee: mockUserList[0],
      roles: ["Client"],
      fields: []
    },
    {
      status: { "orderStatusId": 4, "description": "COMPLETED" },
      userId: mockOrderItem.client.id,
      employee: mockUserList[0],
      roles: ["Client"],
      fields: []
    },
    // Logged user is worker and user is creator of order
    {
      status: { "orderStatusId": 1, "description": "NEW" },
      userId: mockOrderItem.client.id,
      employee: null,
      roles: ["Client", "Worker"],
      fields: [
        { "orderStatusId": 5, "description": "CANCELED" }
      ]
    },
    {
      status: { "orderStatusId": 2, "description": "CONFIRMED" },
      userId: mockOrderItem.client.id,
      employee: mockUserList[0],
      roles: ["Client", "Worker"],
      fields: [
        { "orderStatusId": 5, "description": "CANCELED" }
      ]
    },
    {
      status: { "orderStatusId": 3, "description": "ONGOING" },
      userId: mockOrderItem.client.id,
      employee: mockUserList[0],
      roles: ["Client", "Worker"],
      fields: []
    },
    {
      status: { "orderStatusId": 4, "description": "COMPLETED" },
      userId: mockOrderItem.client.id,
      employee: mockUserList[0],
      roles: ["Client", "Worker"],
      fields: []
    },
    // Logged user is admin and user is creator of order
    {
      status: { "orderStatusId": 1, "description": "NEW" },
      userId: mockOrderItem.client.id,
      employee: null,
      roles: ["Client", "Worker", "Administrator"],
      fields: [
        { "orderStatusId": 5, "description": "CANCELED" }
      ]
    },
    {
      status: { "orderStatusId": 2, "description": "CONFIRMED" },
      userId: mockOrderItem.client.id,
      employee: mockUserList[0],
      roles: ["Client", "Worker", "Administrator"],
      fields: [
        { "orderStatusId": 5, "description": "CANCELED" }
      ]
    },
    {
      status: { "orderStatusId": 3, "description": "ONGOING" },
      userId: mockOrderItem.client.id,
      employee: mockUserList[0],
      roles: ["Client", "Worker", "Administrator"],
      fields: []
    },
    {
      status: { "orderStatusId": 4, "description": "COMPLETED" },
      userId: mockOrderItem.client.id,
      employee: mockUserList[0],
      roles: ["Client", "Worker", "Administrator"],
      fields: []
    },
    // Logged user is worker and user is not order owner
    {
      status: { "orderStatusId": 1, "description": "NEW" },
      userId: mockOrderItem.client.id + 1,
      employee: null,
      roles: ["Client", "Worker"],
      fields: [
        { "orderStatusId": 2, "description": "CONFIRMED" }
      ]
    },
    {
      status: { "orderStatusId": 2, "description": "CONFIRMED" },
      userId: mockOrderItem.client.id + 1,
      employee: mockUserList[0],
      roles: ["Client", "Worker"],
      fields: [
        { "orderStatusId": 3, "description": "ONGOING" }
      ]
    },
    {
      status: { "orderStatusId": 3, "description": "ONGOING" },
      userId: mockOrderItem.client.id + 1,
      employee: mockUserList[0],
      roles: ["Client", "Worker"],
      fields: [
        { "orderStatusId": 4, "description": "COMPLETED" }
      ]
    },
    {
      status: { "orderStatusId": 4, "description": "COMPLETED" },
      userId: mockOrderItem.client.id + 1,
      employee: mockUserList[0],
      roles: ["Client", "Worker"],
      fields: []
    },
    // Logged user is admin and user is not order owner
    {
      status: { "orderStatusId": 1, "description": "NEW" },
      userId: mockOrderItem.client.id + 1,
      employee: null,
      roles: ["Client", "Worker", "Administrator"],
      fields: [
        { "orderStatusId": 2, "description": "CONFIRMED" }
      ]
    },
    {
      status: { "orderStatusId": 2, "description": "CONFIRMED" },
      userId: mockOrderItem.client.id + 1,
      employee: mockUserList[0],
      roles: ["Client", "Worker", "Administrator"],
      fields: [
        { "orderStatusId": 3, "description": "ONGOING" }
      ]
    },
    {
      status: { "orderStatusId": 3, "description": "ONGOING" },
      userId: mockOrderItem.client.id + 1,
      employee: mockUserList[0],
      roles: ["Client", "Worker", "Administrator"],
      fields: [
        { "orderStatusId": 4, "description": "COMPLETED" }
      ]
    },
    {
      status: { "orderStatusId": 4, "description": "COMPLETED" },
      userId: mockOrderItem.client.id + 1,
      employee: mockUserList[0],
      roles: ["Client", "Worker", "Administrator"],
      fields: []
    }
  ]
  .forEach(entry => {
    test(`For status "${entry.status.description}"; userId: ${entry.userId} and roles: [${entry.roles.join(",")}] menu should contain items: [${entry.fields.map(x => x.description).join(",")}]`, async () => {
      Object.defineProperty(document, "cookie", {
        writable: true,
        value: `token=test-token; id=${entry.userId}; role=${entry.roles.join(",")}`
      });

      let processedOrder: Order = Object.assign({}, mockOrderItem);
      processedOrder.orderStatus = OrderUtils.processOrderStatus(entry.status);
      processedOrder.employee = entry.employee!;

      render(
        <OrderStatusWidget
          order={processedOrder}
          callbackBuilder={orderStatusStateChangeCallbackBuilder}
        />
      );

      const orderStatusWidgetButton = await screen.findByRole("order-status-widget-button");

      fireEvent.click(orderStatusWidgetButton);

      const orderStatusWidgetMenuItems = await screen.queryAllByRole("order-status-widget-menu-item");
      expect(orderStatusWidgetMenuItems.length).toEqual(entry.fields.length);

      for(let i = 0; i < entry.fields.length; i++) {
        let processedOrderStatus = OrderUtils.processOrderStatus(entry.fields[i]);
        let colors = OrderUtils.getOrderStatusColor(processedOrderStatus.description);
        expect(orderStatusWidgetMenuItems[i]).toHaveStyle({
          background: colors.background,
          color: colors.color
        });
        expect(orderStatusWidgetMenuItems[i]).toHaveTextContent(processedOrderStatus.visibleText!);
      }
    });
  });


  test("After menu item click, it should run callbackRunner", async () => {
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: `token=test-token; role=["Client", "Worker"]`
    });

    render(<OrderStatusWidget order={mockOrderItem} callbackBuilder={orderStatusStateChangeCallbackBuilder} />);

    const orderStatusWidgetButton = await screen.findByRole("order-status-widget-button");

    fireEvent.click(orderStatusWidgetButton);

    const orderStatusWidgetMenuItems = await screen.getAllByRole("order-status-widget-menu-item");

    orderStatusWidgetMenuItems.forEach(item => {
      let spy = jest.spyOn(orderStatusStateChangeCallbackBuilder, "run");
      fireEvent.click(item);
      expect(spy).toBeCalledTimes(1);
      spy.mockClear();
    });
  });
});