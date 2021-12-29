import { OrderStatus } from "types";
import { OrderStatusStateChangeCallbackBuilder } from "./OrderStatusChangeCallbackFactory";


export interface OrderStatusWidgetProps {
  value?: OrderStatus;
  completed: boolean;
  callbackBuilder: OrderStatusStateChangeCallbackBuilder;
}