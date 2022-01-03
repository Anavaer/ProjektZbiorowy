import { OrderListAddNewOrderValidator } from "./OrderListAddNewOrderValidator";

export class RequiredOrderListAddNewOrderValidator implements OrderListAddNewOrderValidator {
  fieldName: string;
  errorMessage: string;
  validatorFn: (value: string) => boolean;

  constructor(fieldName: string) {
    this.fieldName = fieldName;
    this.errorMessage = "To pole jest wymagane";
    this.validatorFn = (value: string) => value != null && (value+"").length > 0;
  }
}