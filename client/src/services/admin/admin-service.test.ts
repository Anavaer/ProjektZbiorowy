import { AdminService } from "./admin-service";
import axios from "axios";
import { ServicePrice, User } from "types";
import { mockServicePriceList, mockUserList } from "__mocks__/admin";

jest.mock("axios");

let mockAxios = axios as jest.Mocked<typeof axios>;
let adminService: AdminService = new AdminService({ token: "test-token" });



describe("AdminServiceTest", () => {

  beforeEach(() => {
    mockAxios.get.mockImplementation(url => {
      switch(url) {
        case "/api/admin/users":
          return Promise.resolve({ data: mockUserList });
        case "/api/admin/services":
          return Promise.resolve({ data: mockServicePriceList });
        default:
          return Promise.reject(new Error("Unexpected"));
      }
    })
  });

  test("getUsers", async () => {
    let res: User[] = await adminService.getUsers();

    expect(res.length).toEqual(2);

    res.forEach(x => {
      expect(x.id).toBeGreaterThan(0);
      expect(x.roles?.length).toBeGreaterThanOrEqual(1);
      expect(x.roles?.includes("Client")).toBe(true);
    })
  });






  test("getServices", async () => {
    let res: ServicePrice[] = await adminService.getServices();

    expect(res.length).toEqual(3);

    res.forEach(x => {
      expect(x.id).toBeGreaterThan(0);
      expect(x.id).toEqual(parseInt(x.id + ""));
      expect(x.description).toBe(`Dummy Service 0${res.length - x.id + 1}`);
      expect(x.priceRatio).toBeGreaterThan(0);
    })
  });
});