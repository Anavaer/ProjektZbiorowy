import axios from "axios";
import { ServicePrice, User } from "types";
import { AuthUtils } from "utils/auth-utils";

export class AdminService {
  private authUtils: AuthUtils;

  constructor(cookies: any) {
    this.authUtils = new AuthUtils(cookies);
  }


  public getUsers(): Promise<User[]> {
    return axios.get("/api/admin/users", this.authUtils.includeAuthorization())
      .then(res => res.data);
  }

  public getServices(): Promise<ServicePrice[]> {
    return axios.get("/api/admin/services", this.authUtils.includeAuthorization())
      .then(res => res.data);
  }
}