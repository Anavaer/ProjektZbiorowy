import { Order } from "types";
import { OrderStatusStateChangeCallbackBuilder } from "./OrderStatusStateChangeCallbackBuilder";


export interface OrderStatusWidgetProps {
  order?: Order;
  callbackBuilder: OrderStatusStateChangeCallbackBuilder;
}