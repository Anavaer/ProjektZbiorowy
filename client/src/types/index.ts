export type { Order } from "./order/Order";
export type { OrderDTO } from "./order/OrderDTO";
export type { OrderStatus } from "./order/OrderStatus";
export type { ServicePrice } from "./ServicePrice";
export type { Role } from "./user/Role";
export type { User } from "./user/User";
export type { UserRole } from "./user/UserRole";

export interface SignUpData {
  username: String,
  password: String,
  companyName?: String,
  nip?: String,
  firstName?: String,
  lastName?: String,
  city?: String,
  address?: String
}