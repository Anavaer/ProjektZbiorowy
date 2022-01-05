export class UserRoleUtils {
  public static isClient = (roles?: string[]): boolean => (roles ?? []).includes("Client");

  public static isWorker = (roles?: string[]): boolean => 
    UserRoleUtils.isClient(roles) && (roles ?? []).includes("Worker");

  public static isAdmin = (roles?: string[]): boolean => UserRoleUtils.isWorker(roles) && (roles ?? []).includes("Administrator");
}