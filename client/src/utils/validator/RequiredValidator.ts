import { Validator } from "./Validator";

export class RequiredValidator implements Validator {
  fieldName: string;
  errorMessage: string;
  validatorFn: (value: string) => boolean;

  constructor(fieldName: string) {
    this.fieldName = fieldName;
    this.errorMessage = "To pole jest wymagane";
    this.validatorFn = (value: string) => value != null && (value+"").length > 0;
  }
}