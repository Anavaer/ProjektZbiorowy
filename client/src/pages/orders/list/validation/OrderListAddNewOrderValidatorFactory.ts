import { OrderListAddNewOrderValidator } from "./OrderListAddNewOrderValidator";

export class OrderListAddNewOrderValidatorFactory {
  private validators: any = {};
  private errors: any = {};

  public addValidator(validator: OrderListAddNewOrderValidator): OrderListAddNewOrderValidatorFactory {
    if (!this.validators[validator.fieldName]) {
      this.validators[validator.fieldName] = { validators: [validator] };
    }
    if (!this.validators[validator.fieldName].validators.includes(validator)) {
      this.validators[validator.fieldName].validators.push(validator);
    }

    return this;
  }

  public getErrors = (): any => this.errors;
  public getErrorMessage = (fieldName: string): string => this.errors[fieldName]?.errorMessage;
  public hasError = (fieldName: string): boolean => this.errors[fieldName] != null;
  public hasAnyError = (): boolean => Object.keys(this.errors).length > 0;

  public run = (fieldName: string, value: any): void => {
    let found = this.validators[fieldName]?.validators.filter((validator: any) => !validator.validatorFn(value))[0];

    if (typeof found == "undefined") {
      if (typeof this.errors[fieldName] != "undefined") {
        delete this.errors[fieldName];
      }
    } 
    else {
      let errorMessage = found.errorMessage;
      this.errors[fieldName] = { errorMessage: errorMessage };
    }
  }
}