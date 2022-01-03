import { AlertColor } from "@mui/material/Alert/Alert";

export interface CustomSnackbarOptions {
  opened: boolean;
  message: string;
  severity: AlertColor;
}