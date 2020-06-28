//引入foo主进程
const $db = require("electron").remote.app.$db;
const $sql = require("electron").remote.app.$sql;

console.log($db);

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
  loadAlarmStats() {
    return new Promise((resolve, reject) => {
      this.getConfig().then((config) => {
        $sql
          .query(config)
          .then((res) => {
            resolve(res.recordset || []);
          })
          .catch((err) => {
            reject(err);
          });
      });
    });
  },
  loadAlarmResources() {
    return Promise.all([this.loadAlarmStats(), this.getConfig()]).then(
      (allRes) => {
        var alarmStats = allRes[0][0] || {};
        var authResources = (allRes[1] && allRes[1].authResources) || [];
        var alarms = [];
        authResources.forEach((item) => {
          if (alarmStats[item.key] && +alarmStats[item.key] > 100) {
            alarms.push(item.id);
          }
        });
        return alarms;
      }
    );
  },
};
