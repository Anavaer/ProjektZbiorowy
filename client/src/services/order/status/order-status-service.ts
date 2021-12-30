import axios from "axios";
import { OrderStatus } from "types";
import { AuthUtils } from "utils/auth-utils";

export class OrderStatusService {
  private authUtils: AuthUtils;

  constructor(cookies: any) {
    this.authUtils = new AuthUtils(cookies);
  }


  public getAllOrderStatuses(): Promise<OrderStatus[]> {
    return axios.get("/api/orderStatus/orderstatuses", this.authUtils.includeAuthorization())
      .then(res => res.data);
  }
}