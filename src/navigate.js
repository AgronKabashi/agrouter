export {
  navigate
};

function findRoute (routes, pathPart) {
  // Do we have a direct match?
  if (routes[pathPart]) {
    return {
      route: routes[pathPart]
    };
  }

  // Find the routes with regular expressions and find a match
  let match;
  const routeKey = Object.keys(routes)
    .filter(key => key.startsWith("/") && key.endsWith("/"))
    .find(key => (match = pathPart.match(key.substr(1, key.length - 2))));

  return {
    route: routeKey ? routes[routeKey] : {},
    matchData: routeKey && match
  };
}

function navigate (pathname, pushState = true) {
  const initialReducerState = {
    actionPayloads: [],
    routes: this.routes
  };

  const pathParts = pathname.split("/");
  const { actionPayloads } = pathParts
    .reduce(({ actionPayloads, routes = {} }, pathPart) => {
      pathPart = pathPart || "/";
      const { route, matchData } = findRoute(routes, pathPart);

      // if (!route) {
      //   throw new Error("Route does not exist");
      // }

      if (typeof route === "function") {
        actionPayloads.push(route());
      } else if (route.action) {
        actionPayloads.push(route.action(matchData));
      }

      return {
        actionPayloads,
        routes: route.routes
      };
    }, initialReducerState);

  pushState && history.pushState(null, null, pathname);

  return {
    pathname,
    actionPayloads,
    pathParts
  };
}
