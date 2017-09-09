'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function isPromise (obj) {
  return !!obj && typeof obj === "object" && typeof obj.then === "function";
}

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
    }); })
    .catch(function (error) {
      if (error.message !== "404") {
        throw error;
      }

      var notFoundRoute = routes["404"];
      return {
        uri: uri,
        uriSegments: [{
          actionResult: notFoundRoute && notFoundRoute()
        }]
      };
    });
}

function getActionOrDefault (output) {
  return typeof output === "function" && output || typeof output.action === "function" && output.action || (function () {});
}

function getRouteInfo (uriSegment, routes) {
  // Do we have a direct match?
  if (routes[uriSegment]) {
    return {
      action: function () { return getActionOrDefault(routes[uriSegment])(); },
      subRoutes: routes[uriSegment].routes
    };
  }

  // Attempt to locate a route that matches the specified uri segment using regular expressions
  var match;
  var routeKey = Object.keys(routes)
    // A route that starts and ends with a "/" is a regular expression route
    .filter(function (key) { return key.startsWith("/"); })
    // Execute each one until we find one that matches our uriSegment
    .find(function (key) {
      var lastSlashIndex = key.lastIndexOf("/");
      var regexFlags = key.substring(lastSlashIndex + 1);
      var regex = new RegExp(key.substring(1, lastSlashIndex), regexFlags);

      return (match = uriSegment.match(regex));
    });

  if (match) {
    match = match || [];

    return {
      action: function () { return getActionOrDefault(routes[routeKey])(match); },
      subRoutes: routes[routeKey].routes
    };
  }

  // We've encountered a route that doesn't exist in the routes config
  var hasCatchRestRule = routes["*"];
  if (!hasCatchRestRule) {
    throw new Error("404");
  }

  return {
    action: function (remainingUriSegments) { return getActionOrDefault(routes["*"])(remainingUriSegments); },
    abortChain: true
  };
}

function getUriSegmentResult (ref, routes) {
  var firstUriSegment = ref[0];
  var remainingUriSegments = ref.slice(1);
  if ( routes === void 0 ) routes = {};

  var uriSegment = firstUriSegment === "" ? "/" : firstUriSegment;
  var ref$1 = getRouteInfo(uriSegment, routes);
  var action = ref$1.action;
  var subRoutes = ref$1.subRoutes;
  var abortChain = ref$1.abortChain;

  var actionPayload = action(remainingUriSegments);
  var promise = isPromise(actionPayload) ? actionPayload : Promise.resolve(actionPayload);

  return promise.then(function (actionResult) {
    var segmentResult = {
      uriSegment: uriSegment,
      actionResult: actionResult
    };

    if (!abortChain && remainingUriSegments.length) {
      return getUriSegmentResult(remainingUriSegments, subRoutes)
        .then(function (nestedResults) { return [segmentResult ].concat( nestedResults); });
    }

    return [segmentResult];
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

var ROUTE_PRESETS = {
  NUMBER: /(\d+)/,
  STRICT_NUMBER: /^\d+$/,
  KEY_VALUE_PAIRS: /([\w-]+)=([^&]*)/g,
  CATCH_ALL: /[\\s\\S]+/
};

exports.createRouter = createRouter;
exports.ROUTE_PRESETS = ROUTE_PRESETS;
