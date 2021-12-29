import { OrderStatus } from "types";


export interface OrderDetailsColorsOptions { 
  background: string;
  backgroundDark: string;
  color: string;
}


export interface OrderDetailsStatusOptions {
  list?: OrderStatus[];
  colors?: OrderDetailsColorsOptions;
  anchorEl?: HTMLElement;
  loading: boolean;
  menuOpened: boolean;
  completed: boolean;
}