import { AdminService } from "./admin-service";
import axios from "axios";
import { ServicePrice, User } from "types";

jest.mock("axios");

let mockAxios = axios as jest.Mocked<typeof axios>;
let adminService: AdminService = new AdminService({ token: "test-token" });



describe("AdminServiceTest", () => {
  test("getUsers", async () => {

    mockAxios.get.mockResolvedValueOnce({
      data: [
        { "id": 1, "firstName": "Client", "lastName": "Clientowski", "companyName": "Moja firma", "roles": ["Client"] },
        { "id": 2, "firstName": "Worker", "lastName": "Workerowski", "companyName": "Moja firma", "roles": ["Client", "Worker"] }
      ]
    });

    let res: User[] = await adminService.getUsers();

    expect(res.length).toEqual(2);

    res.forEach(x => {
      expect(x.id).toBeGreaterThan(0);
      expect(x.roles?.length).toBeGreaterThanOrEqual(1);
      expect(x.roles?.includes("Client")).toBe(true);
    })
  });






  test("getServices", async () => {

    mockAxios.get.mockResolvedValueOnce({
      data: [
        { "id": 1, "description": "Dummy Service 03", "priceRatio": 0.75 },
        { "id": 2, "description": "Dummy Service 02", "priceRatio": 1.8 },
        { "id": 3, "description": "Dummy Service 01", "priceRatio": 2 }
      ]
    });

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