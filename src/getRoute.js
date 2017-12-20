import { ROUTE_ACTION } from "./constants";

export {
  getRoute
};

function getActionOrDefault (route) {
  return typeof route === "function" && route || typeof route[ROUTE_ACTION] === "function" && route[ROUTE_ACTION] || (() => {});
}

function getRoute (routeTable, uriSegment) {
  let route = routeTable[uriSegment];
  if (route) {
    return {
      action: () => getActionOrDefault(route)(),
      route
    };
  }

  let match;
  const routeKey = Object.keys(routeTable)
    // A route that starts with a "/" is a regular expression route
    .filter(key => key.startsWith("/"))
    // Execute each one until we find one that matches our uriSegment
    .find(key => {
      const lastSlashIndex = key.lastIndexOf("/");
      const regexFlags = key.substring(lastSlashIndex + 1);
      const regex = new RegExp(key.substring(1, lastSlashIndex), regexFlags);

      return (match = uriSegment.match(regex));
    });

  if (match) {
    route = routeTable[routeKey];
    return {
      action: () => getActionOrDefault(route)(match),
      route
    };
  }

  route = routeTable["*"];
  if (route) {
    return {
      action: remainingSegments => getActionOrDefault(route)(remainingSegments),
      route,
      stopTraversing: true
    };
  }

  throw new Error("404");
}
