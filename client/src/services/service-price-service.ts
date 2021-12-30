import { ServicePrice } from "types";
import { AuthUtils } from "utils/auth-utils";

export class ServicePriceService {
  private authUtils: AuthUtils;

  constructor(cookies: any) {
    this.authUtils = new AuthUtils(cookies);
  }

  
  // TODO: implement axios when I get the controller
  public getServicePriceList(): Promise<ServicePrice[]> {
    return new Promise<ServicePrice[]>((resolve, reject) => {
      let res: ServicePrice[] = [];
      for (let i = 0; i < 3; i++)
        res.push({ id: i + 1, description: `Dummy service 0${i + 1}`, priceRatio: Math.random() });
      resolve(res);
    });
  }
}