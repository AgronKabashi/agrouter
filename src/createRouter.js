import { navigate } from "./navigate";

const defaultOptions = {};

export function createRouter (routes = [], options = defaultOptions) {
  const { history } = options;

  if (!history) {
    throw new Error("agrouter: History was not supplied");
  }

  return {
    routes,
    navigate: (uri, pushState) => navigate(uri, routes, history, pushState)
  };
}
