import { OrderStatus } from "types";
import { OrderStatusWidgetData } from "./order-status-widget-data";

export class OrderStatusStateChangeCallbackBuilder {
  private methods: any[] = [];

  public addMethod(status: string, method: (data: OrderStatusWidgetData) => void): OrderStatusStateChangeCallbackBuilder {
    this.methods.push({
      status: status,
      method: method
    });

    return this;
  }

  public run = (orderStatus: OrderStatus, data: OrderStatusWidgetData): void => 
    this.methods.filter(x => x.status == orderStatus.description)[0]?.method(data);
}