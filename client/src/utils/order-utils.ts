import { blue, green, grey, red, yellow } from "@mui/material/colors";
import { OrderStatusWidgetColorsOptions } from "pages/orders/components/order-status/order-status-widget-colors-props";
import { Order, OrderStatus } from "types";

export class OrderUtils {

  public static processOrder(input: any): Order {
    input.serviceDate = new Date(input.serviceDate);
    input.totalPrice = Math.floor(input.totalPrice * 100) / 100;
    input.orderStatus = OrderUtils.processOrderStatus(input.orderStatus);
    
    return input;
  }


  public static getOrderStatusColor(orderStatusDescription: string): OrderStatusWidgetColorsOptions {
    let res: OrderStatusWidgetColorsOptions;

    switch(orderStatusDescription) {
      case "NEW":         res = { background: grey[500], backgroundDark: grey[700], color: "white" }; break;
      case "CONFIRMED":   res = { background: yellow[500], backgroundDark: yellow[700], color: "black" }; break;
      case "ONGOING":     res = { background: blue[500], backgroundDark: blue[700], color: "white" }; break;
      case "COMPLETED":   res = { background: green[500], backgroundDark: green[700], color: "white" }; break;
      case "CANCELED":    res = { background: red[500], backgroundDark: red[700], color: "white" }; break;
      default:            res = { background: grey[500], backgroundDark: grey[700], color: "white" }; break;
    }

    return res;
  }

  public static isCompleted = (order?: Order): boolean => order?.orderStatus.description == "COMPLETED" || order?.orderStatus.description == "CANCELED";


  public static processOrderStatus(input: OrderStatus): OrderStatus {

    switch (input.description) {
      case "NEW": input.visibleText = "Nowe"; break;
      case "CONFIRMED": input.visibleText = "Zatwierdzone"; break;
      case "ONGOING": input.visibleText = "W trakcie"; break;
      case "COMPLETED": input.visibleText = "Zakończone"; break;
      case "CANCELED": input.visibleText = "Anulowane"; break;
    }

    return input;
  }
}