var sql =  require("mssql");

module.exports = {
  query(config) {
    return new Promise((resolve, reject) => {
      sql
        .connect({
          server: config.alarmDbIp,
          port: +config.alarmDbPort,
          database: config.alarmDbName,
          user: config.alarmDbUser,
          password: config.alarmDbPassword,
        })
        .then(() => {
          return sql.query(config.querySql);
        })
        .then((result) => {
          resolve(result);
          sql.close();
        })
        .catch((err) => {
          sql.close();
          reject(err);
        });
    });
  },
};
