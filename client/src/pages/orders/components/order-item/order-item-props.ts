import { Order } from "types";

export interface OrderItemProps {
  order: Order;
  onChangeAssignment: (success: boolean, errorMessage?: string) => void
}