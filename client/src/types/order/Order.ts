import { OrderStatus } from "./OrderStatus";
import { ServicePrice } from "../ServicePrice";
import { User } from "../user/User";

export interface Order {
  orderId: number;
  client: User;
  serviceDate: Date;
  orderStatus: OrderStatus;
  city: string;
  address: string;
  area: number;
  employee?: User;
  totalPrice: number;
  servicePrices: ServicePrice[];
}