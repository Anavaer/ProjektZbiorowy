import { blue, green, grey, red, yellow } from "@mui/material/colors";
import { OrderStatusWidgetColorsOptions } from "pages/orders/components/order-status/order-status-widget-colors-props";
import { Order } from "types";

export class OrderUtils {

  // TODO: Wywalić pętlę, która dodaje usługi, jak dostanę dane z backendu
  public static processOrder(input: any): Order {
    input.serviceDate = new Date(input.serviceDate);
    input.totalPrice = Math.floor(input.totalPrice * 100) / 100;
    input.servicePrices = [];
    
    for(let i = 0; i < 3; i++) {
      input.servicePrices.push({id: i + 1, description: `Service price ${i + 1}`, priceRatio: 0.3})
    }
    
    return input;
  }


  public static getOrderStatusColor(orderStatus: string): OrderStatusWidgetColorsOptions {
    let res: OrderStatusWidgetColorsOptions;

    switch(orderStatus) {
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
}