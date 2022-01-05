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

  public getUser(id: number): Promise<User> {
    return axios.get(`/api/admin/users/${id}`, this.authUtils.includeAuthorization())
      .then(res => res.data);
  }

  public editRole(id: number, queryString: String): Promise<User> {
    return axios.put(`/api/admin/edit-role/${id}?${queryString}`,{},  this.authUtils.includeAuthorization())
      .then(res => res.data);
  }

  public getServices(): Promise<ServicePrice[]> {
    return axios.get("/api/admin/services", this.authUtils.includeAuthorization())
      .then(res => res.data);
  }

  public editService(serviceId: Number, description: String, priceRatio: Number): Promise<any> {
    return axios.put(`/api/admin/edit-service/${serviceId}`, { description, priceRatio, unitPrice: priceRatio }, this.authUtils.includeAuthorization())
      .then(res => res.data);
  }

  public createService({description, priceRatio }: {description: String, priceRatio: Number}): Promise<any> {
    return axios.post(`/api/admin/add-service`, { description, priceRatio, unitPrice: priceRatio }, this.authUtils.includeAuthorization())
      .then(res => res.data);
  }
}