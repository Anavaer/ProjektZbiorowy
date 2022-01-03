import { OrderStatus } from "types";
import { OrderStatusStateChangeCallbackBuilder } from "./OrderStatusStateChangeCallbackBuilder";


export interface OrderStatusWidgetProps {
  value?: OrderStatus;
  completed: boolean;
  callbackBuilder: OrderStatusStateChangeCallbackBuilder;
}