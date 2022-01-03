import {AuthUtils} from "./auth-utils";

const authUtils: AuthUtils = new AuthUtils({ token: "test-token" });

describe("AuthUtilsTest", () => {
  test("includeAuthorizationTest", () => {
    expect(authUtils.includeAuthorization()).toStrictEqual({
      headers: {
        "Authorization": `Bearer test-token`
      }
    });
  });
});