import {AuthUtils} from "./auth-utils";

const authUtils: AuthUtils = new AuthUtils("test-token");

describe("AuthUtilsTest", () => {
  test("includeAuthorizationTest", () => {
    expect(authUtils.includeAuthorization()).toStrictEqual({
      headers: {
        "Authorization": `Bearer test-token`
      }
    });
  });
});