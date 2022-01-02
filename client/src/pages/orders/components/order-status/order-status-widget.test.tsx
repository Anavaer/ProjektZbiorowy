import { fireEvent, render, screen } from "@testing-library/react";
import axios from "axios";
import * as React from 'react';
import { OrderUtils } from "utils/order-utils";
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
  })


  test("Should render order status widget correctly", async () => {
    render(<OrderStatusWidget value={mockOrderItem.orderStatus} completed={false} callbackBuilder={orderStatusStateChangeCallbackBuilder} />);
    const orderStatusWidget = await screen.findByRole("order-status-widget");
    const orderStatusWidgetButton = await screen.findByRole("order-status-widget-button");

    const colors = OrderUtils.getOrderStatusColor(mockOrderItem.orderStatus.description);

    expect(orderStatusWidget).toBeInTheDocument();
    expect(orderStatusWidgetButton).toHaveTextContent(mockOrderItem.orderStatus.description);
    expect(orderStatusWidgetButton).not.toBeDisabled();
    expect(orderStatusWidgetButton).toHaveStyle({
      backgroundColor: colors.background,
      color: colors.color
    });
  });


  test("For not completed order, button should open menu", async () => {
    render(<OrderStatusWidget value={mockOrderItem.orderStatus} completed={false} callbackBuilder={orderStatusStateChangeCallbackBuilder} />);
    const orderStatusWidgetButton = await screen.findByRole("order-status-widget-button");

    fireEvent.click(orderStatusWidgetButton);

    const orderStatusWidgetMenu = await screen.findByRole("order-status-widget-menu");
    expect(orderStatusWidgetMenu).toBeInTheDocument();
  });


  test("For completed order, button should not open menu", async () => {
    render(<OrderStatusWidget value={mockOrderItem.orderStatus} completed={true} callbackBuilder={orderStatusStateChangeCallbackBuilder} />);
    const orderStatusWidgetButton = await screen.findByRole("order-status-widget-button");

    fireEvent.click(orderStatusWidgetButton);

    const orderStatusWidgetMenu = await screen.queryByRole("order-status-widget-menu");
    expect(orderStatusWidgetMenu).toBeNull();
  });



  
  [
    {
      status: { "orderStatusId": 1, "description": "NEW" },
      fields: [
        { "orderStatusId": 2, "description": "CONFIRMED" },
        { "orderStatusId": 5, "description": "CANCELED" }
      ]
    },
    {
      status: { "orderStatusId": 2, "description": "CONFIRMED" },
      fields: [
        { "orderStatusId": 3, "description": "ONGOING" },
        { "orderStatusId": 5, "description": "CANCELED" }
      ]
    },
    {
      status: { "orderStatusId": 3, "description": "ONGOING" },
      fields: [
        { "orderStatusId": 4, "description": "COMPLETED" },
        { "orderStatusId": 5, "description": "CANCELED" }
      ]
    }
  ]
  .forEach(entry => {
    test(`For status "${entry.status.description}" menu should contain fields: ${entry.fields.map(x => x.description).join(",")}`, async () => {
      render(
        <OrderStatusWidget
          value={entry.status}
          completed={["COMPLETED", "CANCELED"].includes(entry.status.description)}
          callbackBuilder={orderStatusStateChangeCallbackBuilder}
        />
      );

      const orderStatusWidgetButton = await screen.findByRole("order-status-widget-button");

      fireEvent.click(orderStatusWidgetButton);

      const orderStatusWidgetMenuItems = await screen.getAllByRole("order-status-widget-menu-item");
      expect(orderStatusWidgetMenuItems.length).toEqual(entry.fields.length);

      for(let i = 0; i < entry.fields.length; i++) {
        let colors = OrderUtils.getOrderStatusColor(entry.fields[i].description);
        expect(orderStatusWidgetMenuItems[i]).toHaveStyle({
          background: colors.background,
          color: colors.color
        });
      }
    });
  });


  test("After menu item click, it should run callbackRunner", async () => {
    render(<OrderStatusWidget value={mockOrderItem.orderStatus} completed={false} callbackBuilder={orderStatusStateChangeCallbackBuilder} />);

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