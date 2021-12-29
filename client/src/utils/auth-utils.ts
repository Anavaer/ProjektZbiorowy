import { AxiosRequestConfig } from "axios";

export class AuthUtils {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  public includeAuthorization(): AxiosRequestConfig<any> {
    return {
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    };
  }
}