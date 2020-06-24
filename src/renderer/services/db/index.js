import path from "path";
import { remote } from "electron";
import nedb from "nedb";

const DB_FILE = "/dag-components.db";

var stores = {};

var $db = (window.$db = {
  store(modelName) {
    if (!stores[modelName]) {
      console.log(
        path.join(
          remote.app.getPath("userData"),
          `dag-develtools-${modelName}.db`
        )
      );
      stores[modelName] = new nedb({
        autoload: true,
        filename: path.join(
          remote.app.getPath("userData"),
          `dag-develtools-${modelName}.db`
        ),
      });
    }
    return stores[modelName];
  },
  insert(modelName, model) {
    return new Promise((resolve, reject) => {
      var store = this.store(modelName);
      store.insert(model, (err, newModel) => {
        if (err != null) {
          reject(err);
        } else {
          resolve(newModel);
        }
      });
    });
  },
  save(modelName, model) {
    return new Promise((resolve, reject) => {
      var store = this.store(modelName);
      store.update(
        { _id: model._id },
        model,
        { upsert: true },
        (err, num, newModel) => {
          if (err != null) {
            reject(err);
          } else {
            resolve(newModel);
          }
        }
      );
    });
  },
  find(modelName, query, sort) {
    return new Promise((resolve, reject) => {
      var store = this.store(modelName);
      var q = store.find(query);
      if (sort) {
        q = q.sort(sort);
      }
      q.exec((err, models) => {
        if (err != null) {
          reject(err);
        } else {
          resolve(models);
        }
      });
    });
  },
  findOne(modelName, query) {
    return new Promise((resolve, reject) => {
      var store = this.store(modelName);
      store.findOne(query, (err, model) => {
        if (err != null) {
          reject(err);
        } else {
          resolve(model);
        }
      });
    });
  },
  remove(modelName, query) {
    return new Promise((resolve, reject) => {
      var store = this.store(modelName);
      store.remove(
        query._id ? { _id: query._id } : query,
        { multi: true },
        (err, numRemoved) => {
          if (err != null) {
            reject(err);
          } else {
            resolve(numRemoved);
          }
        }
      );
    });
  },
});
