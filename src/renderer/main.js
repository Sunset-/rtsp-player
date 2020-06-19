import Vue from "vue";
import axios from "axios";

import App from "./App";
import router from "./router";

//第三方依赖
import "./vendor/index.js";
import "./services/index.js";
import "./style/index.less";

//引入组件库
import NetPosaXUI from "./netposa_xui/index.js";
Vue.use(NetPosaXUI);


// import "./components/index.js";

if (!process.env.IS_WEB) Vue.use(require("vue-electron"));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
	components: { App },
	router,
	template: "<App/>"
}).$mount("#app");
