'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var totalRegexSlashLength = 2;

function navigate (uri, routes, history, pushState) {
  if ( pushState === void 0 ) pushState = true;

  // Separate the uri into segments
  var uriSegments = uri === "/" ? ["/"] : uri.split("/");

  // Only update the url if desired since pushState might be false for
  // when navigating back or forth
  pushState && history.pushState(null, null, uri);

  return getUriSegmentResult(uriSegments, routes)
    .then(function (results) { return ({
      uri: uri,
      uriSegments: results
    }); });
}

function findRoute (uriSegment, routes) {
  // Do we have a direct match?
  if (routes[uriSegment]) {
    return {
      output: routes[uriSegment],
      subRoutes: routes[uriSegment].routes
    };
  }

  // Attempt to locate a route that matches the specified uri segment using regular expressions
  var match;
  var routeKey = Object.keys(routes)
    // A route that starts and ends with a "/" is a regular expression route
    .filter(function (key) { return key.startsWith("/") && key.endsWith("/"); })
    // Execute each one until we find one that matches our uriSegment
    .find(function (key) { return (match = uriSegment.match(key.substr(1, key.length - totalRegexSlashLength))); });

  return {
    output: routes[routeKey],
    actionArguments: match,
    subRoutes: routes[routeKey].routes
  };
}

function isPromise (obj) {
  return !!obj && typeof obj === "object" && typeof obj.then === "function";
}

function getUriSegmentResult (ref, routes) {
  var firstUriSegment = ref[0];
  var remainingUriSegments = ref.slice(1);
  if ( routes === void 0 ) routes = {};

  var uriSegment = firstUriSegment === "" ? "/" : firstUriSegment;
  var ref$1 = findRoute(uriSegment, routes);
  var output = ref$1.output; if ( output === void 0 ) output = {};
  var actionArguments = ref$1.actionArguments;
  var subRoutes = ref$1.subRoutes;
  var action = typeof output === "function" && output || typeof output.action === "function" && output.action || (function () {});

  var actionResult = action(actionArguments);
  var promise = isPromise(actionResult) ? actionResult : Promise.resolve(actionResult);

  return promise.then(function (actionResult) {
    var payload = {
      uriSegment: uriSegment,
      actionResult: actionResult
    };

    if (remainingUriSegments.length) {
      return getUriSegmentResult(remainingUriSegments, subRoutes)
        .then(function (recursiveResult) { return [payload ].concat( recursiveResult); });
    }

    return [payload];
  });
}

var defaultOptions = {};

function createRouter (routes, options) {
  if ( routes === void 0 ) routes = [];
  if ( options === void 0 ) options = defaultOptions;

  var history = options.history;

  if (!history) {
    throw new Error("agrouter: History was not supplied");
  }

  return {
    routes: routes,
    navigate: function (uri, pushState) { return navigate(uri, routes, history, pushState); }
  };
}

exports.createRouter = createRouter;
