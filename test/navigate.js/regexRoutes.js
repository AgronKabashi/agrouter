import assert from "assert";
import { navigate } from "navigate";
import {
  regexRoutes,
  rootActionResult,
  catchAllActionResult
} from "./fixtures";

/* eslint-disable promise/always-return */

describe("Regex routes", () => {
  const history = {
    pushState: () => {}
  };

  it("should be possible to add a catch all rule", () => {
    return navigate("/nonexistent", regexRoutes, history).then(result => {
      assert.deepEqual(result, {
        uriSegments: [
          {
            uriSegment: "/",
            actionResult: rootActionResult
          },
          {
            uriSegment: "nonexistent",
            actionResult: catchAllActionResult
          }
        ],
        uri: "/nonexistent"
      });
    });
  });

  it("should be able to extract variables", () => {
    return navigate("/?productId=5&add-to-cart=true", regexRoutes, history).then(result => {
      assert.deepEqual(result, {
        uriSegments: [
          {
            uriSegment: "/",
            actionResult: rootActionResult
          },
          {
            uriSegment: "?productId=5&add-to-cart=true",
            actionResult: "Regex: Extracting variables - productId=5,add-to-cart=true"
          }
        ],
        uri: "/?productId=5&add-to-cart=true"
      });
    });
  });
});
