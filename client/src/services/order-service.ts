import axios from "axios";
import { Order, OrderDTO } from "types";
import { AuthUtils } from "utils/auth-utils";
import { OrderUtils } from "utils/order-utils";

export class OrderService {

  private authUtils: AuthUtils;

  constructor(cookies: any) {
    this.authUtils = new AuthUtils(cookies.token);
  }

  public getOrders(): Promise<Order[]> {
    return axios.get("/api/orders", this.authUtils.includeAuthorization())
      .then(res => res.data)
      .then(res => {
        res.forEach(OrderUtils.processOrder);
        return res;
      });
  }

  public getOrder(id: number): Promise<Order> {
    return axios.get(`/api/orders/${id}`, this.authUtils.includeAuthorization())
      .then(res => res.data)
      .then(res => OrderUtils.processOrder(res));
  }

  public assignOrder(orderId: number, employeeId?: number): Promise<any> {
    return axios.put([`/api/orders/assign/${orderId}`, employeeId && `?employeeId=${employeeId}`].join("/"), {}, this.authUtils.includeAuthorization());
  }

  public startOrder(orderId: number): Promise<any> {
    return axios.put(`/api/orders/start/${orderId}`, {}, this.authUtils.includeAuthorization());
  }

  public cancelOrder(orderId: number): Promise<any> {
    return axios.put(`/api/orders/cancel/${orderId}`, {}, this.authUtils.includeAuthorization());
  }

  public completeOrder(orderId: number): Promise<any> {
    return axios.put(`/api/orders/complete/${orderId}`, {}, this.authUtils.includeAuthorization());
  }

  public createOrder(orderDTO: OrderDTO): Promise<any> {
    return axios.post("/api/orders/create", orderDTO, this.authUtils.includeAuthorization());
  }
}