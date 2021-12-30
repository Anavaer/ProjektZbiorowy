import axios from "axios";
import { OrderStatus } from "types";
import { OrderStatusService } from "./order-status-service";

jest.mock("axios");

let mockAxios = axios as jest.Mocked<typeof axios>;
let orderStatusService: OrderStatusService = new OrderStatusService({ token: "test-token" });

describe("OrderStatusServiceTest", () => {
  test("getAllOrderStatuses", async () => {
    mockAxios.get.mockResolvedValueOnce({
      data: [
        { "orderStatusId": 1, "description": "NEW" },
        { "orderStatusId": 2, "description": "CONFIRMED" },
        { "orderStatusId": 3, "description": "ONGOING" }
      ]
    });

    let res: OrderStatus[] = await orderStatusService.getAllOrderStatuses();

    expect(res.length).toEqual(3);
    res.forEach(orderStatus => {
      expect(orderStatus.orderStatusId).toBeGreaterThan(0);
      expect(orderStatus.orderStatusId).toEqual(parseInt(orderStatus.orderStatusId + ""));
      expect(orderStatus.description).toEqual(orderStatus.description.toLocaleUpperCase());
    });
  });
});