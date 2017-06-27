import { navigate } from "./navigate";

export {
  createRouter
};

const defaultOptions = {};

function createRouter (routes = [], options = defaultOptions) {
  return {
    routes,
    navigate
  };
}
