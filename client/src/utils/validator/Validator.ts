export interface Validator {
  fieldName: string;
  errorMessage: string;
  validatorFn: (value: any) => boolean;
}