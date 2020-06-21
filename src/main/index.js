import { app, BrowserWindow } from "electron";
const { resolve } = require("path");
var path = require("path");

let plugins = resolve(__dirname, "../../lib/pepflashplayer64_32_0_0_387.dll");
if (__dirname.includes(".asar")) {
	plugins = require("path").join(process.resourcesPath + "/lib/pepflashplayer64_32_0_0_387.dll");
}
app.commandLine.appendSwitch("ppapi-flash-path", plugins);

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== "development") {
	global.__static = require("path").join(__dirname, "/static").replace(/\\/g, "\\\\");
}

var express = require("express");
var path = require("path");

if (process.env.NODE_ENV !== "development") {
	var expressApp = express();
	console.log(path.resolve(__dirname, "../static"));
	expressApp.use(express.static(__dirname));
	expressApp.listen(19080);
}

let mainWindow;
const winURL = process.env.NODE_ENV === "development" ? `http://localhost:9080` : `http://localhost:19080/index.html`; //`file://${__dirname}/index.html`

function createWindow() {
	/**
	 * Initial window options
	 */
	mainWindow = new BrowserWindow({
		height: 563,
		useContentSize: true,
		width: 1000,
		webPreferences: {
			plugins: true,
			webSecurity: false,
			nodeIntegration: true, //在网页中集成Node
		},
	});

	mainWindow.loadURL(winURL);

	mainWindow.on("closed", () => {
		mainWindow = null;
	});
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	if (mainWindow === null) {
		createWindow();
	}
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */

const flashTrust = require("nw-flash-trust");
const appName = "rtsp-player";
const trustManager = flashTrust.initSync(appName);
trustManager.add(path.join(__dirname, "..", "..", "static", "video-js.swf"));
console.log(trustManager.list());
