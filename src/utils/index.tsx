import validators from "./validators";
import formatters from "./formatters";
import storage from "./storage";
import api from "./api";
import url from "./urlUtilities";

export default {
  validators,
  formatters,
  storage,
  api,
  url,
  app: {
    init: () => storage.clear()
  }
};
