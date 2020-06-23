const {
    app,
    BrowserWindow,
    ipcMain,
    shell
} = require('electron');


import HikSDK from "./hiksdk.js";

export default {
  loadAllReources() {
    return Promise.all([HikSDK.loadAllRegions(), HikSDK.loadAllCameras()]).then(
      (res) => {
        var regionNodes =  res[0].map(item=>{
            item.id = item.indexCode;
            item.parentId = item.parentIndexCode;
            item.isParent = true;
            return item;
        });
        var resourceNodes =  res[1].map(item=>{
            item.id = item.cameraIndexCode;
            item.parentId = item.regionIndexCode;
            item.isParent = false;
            item.name = item.cameraName;
            return item;
        });
        console.log(1234)
        event.sender.send('asynchronous-reply', regionNodes.concat(resourceNodes));
      }
    );
  },
};
