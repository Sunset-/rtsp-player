var configCache = null;

export default {
  setConfig(model) {
    configCache = null;
    model._id = "$config_id";
    return $db.save("CONFIG", model);
  },
  getConfig() {
    if (configCache) {
      return Promise.resolve(configCache);
    }
    return $db.find("CONFIG", { _id: "$config_id" }).then((res) => {
      return (configCache = res[0] || {});
    });
  },
};
