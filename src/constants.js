export const ROUTE_ACTION = Symbol("Action Route");

export const ROUTE_PRESETS = {
  NUMBER: /(\d+)/,
  STRICT_NUMBER: /^\d+$/,
  KEY_VALUE_PAIRS: /([\w-]+)=([^&]*)/g,
  CATCH_ALL: /[\s\S]+/
};
