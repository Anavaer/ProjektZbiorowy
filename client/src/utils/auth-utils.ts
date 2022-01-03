import { AxiosRequestConfig } from "axios";

export class AuthUtils {
  private token: string;

  constructor(cookies: any) {
    this.token = cookies.token;
  }

  public includeAuthorization(): AxiosRequestConfig<any> {
    return {
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    };
  }
}