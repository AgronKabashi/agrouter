import { navigate } from "./navigate";

export {
  createRouter
};

const defaultOptions = {};

function createRouter (routes = [], options = defaultOptions) {
  const { history = window.history } = options;

  return {
    routes,
    navigate: (uri, pushState) => navigate(uri, routes, history, pushState)
  };
}
