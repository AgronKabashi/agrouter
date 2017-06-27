function findRoute (routes, pathPart) {
  // Do we have a direct match?
  if (routes[pathPart]) {
    return {
      route: routes[pathPart]
    };
  }

  // Find the routes with regular expressions and find a match
  var match;
  var routeKey = Object.keys(routes)
    .filter(function (key) { return key.startsWith("/") && key.endsWith("/"); })
    .find(function (key) { return (match = pathPart.match(key.substr(1, key.length - 2))); });

  return {
    route: routeKey ? routes[routeKey] : {},
    matchData: routeKey && match
  };
}

function navigate (pathname, pushState) {
  if ( pushState === void 0 ) pushState = true;

  var initialReducerState = {
    actionPayloads: [],
    routes: this.routes
  };

  var pathParts = pathname.split("/");
  var ref = pathParts
    .reduce(function (ref, pathPart) {
      var actionPayloads = ref.actionPayloads;
      var routes = ref.routes; if ( routes === void 0 ) routes = {};

      pathPart = pathPart || "/";
      var ref$1 = findRoute(routes, pathPart);
      var route = ref$1.route;
      var matchData = ref$1.matchData;

      // if (!route) {
      //   throw new Error("Route does not exist");
      // }

      var action = typeof route === "function" && route || route.action || (function () {});
      actionPayloads.push(action(matchData));

      return {
        actionPayloads: actionPayloads,
        routes: route.routes
      };
    }, initialReducerState);
  var actionPayloads = ref.actionPayloads;

  pushState && history.pushState(null, null, pathname);

  return {
    pathname: pathname,
    actionPayloads: actionPayloads,
    pathParts: pathParts
  };
}

var defaultOptions = {};

function createRouter (routes, options) {
  if ( routes === void 0 ) routes = [];
  if ( options === void 0 ) options = defaultOptions;

  return {
    routes: routes,
    navigate: navigate
  };
}

export { createRouter };
