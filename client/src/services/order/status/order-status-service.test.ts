import axios from "axios";
import { OrderStatus } from "types";
import { mockOrderStatusList } from "__mocks__/order-status";
import { OrderStatusService } from "./order-status-service";

jest.mock("axios");

let mockAxios = axios as jest.Mocked<typeof axios>;
let orderStatusService: OrderStatusService = new OrderStatusService({ token: "test-token" });

describe("OrderStatusServiceTest", () => {
  test("getAllOrderStatuses", async () => {
    mockAxios.get.mockResolvedValueOnce({
      data: mockOrderStatusList
    });

    let res: OrderStatus[] = await orderStatusService.getAllOrderStatuses();

    expect(res.length).toEqual(mockOrderStatusList.length);
    res.forEach(orderStatus => {
      expect(orderStatus.orderStatusId).toBeGreaterThan(0);
      expect(orderStatus.orderStatusId).toEqual(parseInt(orderStatus.orderStatusId + ""));
      expect(orderStatus.description).toEqual(orderStatus.description.toLocaleUpperCase());
    });
  });
});