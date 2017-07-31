import assert from "assert";
import { navigate } from "../src/navigate";

const rootActionResult = "Root";
const testActionResult = "Test";
const notEmptyActionResult = "NotEmpty";
const catchAllActionResult = "Catch all";

describe("navigate", () => {
  const routes = {
    "/": {
      action: () => rootActionResult,
      routes: {
        "test": () => testActionResult,
        "empty": {
          routes: {
            "notEmpty": () => notEmptyActionResult
          }
        },
        "regex": {
          routes: {
            "/\\?(\\w+)=(\\d+)/": ([, key, value]) => `Regex: Extracting variables - Query: ${key}, Value: ${value}`,
            "/[\\s\\S]+/": () => catchAllActionResult
          }
        }
      }
    }
  };

  const history = {
    pushState: () => {}
  };

  it("should navigate to root and return only one uriSegment", () => {
    assert.deepEqual(navigate("/", routes, history), {
      uriSegments: [
        {
          uriSegment: "/",
          actionResult: rootActionResult
        }
      ],
      uri: "/"
    });
  });

  it("should return uriSegments with data from each segment", () => {
    assert.deepEqual(navigate("/test", routes, history), {
      uriSegments: [
        {
          uriSegment: "/",
          actionResult: rootActionResult
        },
        {
          uriSegment: "test",
          actionResult: testActionResult
        }
      ],
      uri: "/test"
    });
  });

  it("should exclude data from segments missing an action", () => {
    assert.deepEqual(navigate("/empty/notEmpty", routes, history), {
      uriSegments: [
        {
          uriSegment: "/",
          actionResult: rootActionResult
        },
        {
          uriSegment: "empty",
          actionResult: undefined
        },
        {
          uriSegment: "notEmpty",
          actionResult: notEmptyActionResult
        }
      ],
      uri: "/empty/notEmpty"
    });
  });

  describe("Regex routes", () => {
    it("should be possible to add a catch all rule", () => {
      assert.deepEqual(navigate("/regex/nonexistent", routes, history), {
        uriSegments: [
          {
            uriSegment: "/",
            actionResult: rootActionResult
          },
          {
            uriSegment: "regex",
            actionResult: undefined
          },
          {
            uriSegment: "nonexistent",
            actionResult: catchAllActionResult
          }
        ],
        uri: "/regex/nonexistent"
      });
    });

    it("should be able to extract variables", () => {
      assert.deepEqual(navigate("/regex/?productId=5", routes, history), {
        uriSegments: [
          {
            uriSegment: "/",
            actionResult: rootActionResult
          },
          {
            uriSegment: "regex",
            actionResult: undefined
          },
          {
            uriSegment: "?productId=5",
            actionResult: "Regex: Extracting variables - Query: productId, Value: 5"
          }
        ],
        uri: "/regex/?productId=5"
      });
    });
  });
});
