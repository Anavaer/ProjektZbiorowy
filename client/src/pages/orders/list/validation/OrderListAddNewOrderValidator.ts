export interface OrderListAddNewOrderValidator {
  fieldName: string;
  errorMessage: string;
  validatorFn: (value: any) => boolean;
}