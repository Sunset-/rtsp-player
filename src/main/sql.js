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
          return sql.query`select * from tb_inwell`;
        })
        .then((result) => {
          resolve(result);
          console.dir(result);
          sql.close();
        })
        .catch((err) => {
          sql.close();
          reject(err);
        });
    });
  },
};
