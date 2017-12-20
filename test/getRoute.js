import assert from "assert";
import { getRoute } from "getRoute";

describe("getRoute", () => {
  const routeTable = {
    "directMatch": () => "Direct Match",
    [/\d+/]: () => "Found number",
    [/^\d+$/]: () => "Found strict number",
    "*": rest => `Found catch rest :${rest}`
  };

  it("finds a route for static uriSegments", () => {
    const result = getRoute(routeTable, "directMatch");
    assert(result.action() === routeTable.directMatch());
    assert(result.route === routeTable.directMatch);
  });

  it("finds a route for dynamic uriSegments", () => {
    const result = getRoute(routeTable, "5");
    assert(result.action() === routeTable[/\d+/]());
    assert(result.route === routeTable[/\d+/]);
  });

  it("finds a route for catch rest", () => {
    const result = getRoute(routeTable, "abc");
    const rest = "/a/b/c";
    assert(result.action(rest) === routeTable["*"](rest));
    assert(result.route === routeTable["*"]);
  });

  it("throws an error if a uriSegment does not exist", () => {
    assert.throws(() => getRoute({}, "non-existing"));
  });
});
