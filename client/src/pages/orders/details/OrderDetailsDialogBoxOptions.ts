export interface OrderDetailsDialogBoxOptions {
  opened: boolean;
  title?: string;
  content?: string;
  approveFunction?: () => void;
  rejectFunction?: () => void;
}