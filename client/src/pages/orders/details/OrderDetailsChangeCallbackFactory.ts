import { OrderStatus } from "types";

export class OrderDetailsStateChangeCallbackBuilder {
  private methods: any[] = [];

  public addMethod(status: string, method: (orderStatus: OrderStatus) => void): OrderDetailsStateChangeCallbackBuilder {
    this.methods.push({
      status: status,
      method: method
    });

    return this;
  }

  public run = (orderStatus: OrderStatus): void => this.methods.filter(x => x.status == orderStatus.description)[0]?.method(orderStatus);
}