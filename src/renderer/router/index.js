import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
	routes: [
		// {
		// 	path: "/",
		// 	name: "landing-page",
		// 	component: require("@/components/LandingPage").default
		// },
		{
			path: "/",
			name: "Home",
			component: require("@/modules/Home").default
		},
		{
			path: "/test",
			name: "Test",
			component: require("@/modules/Test").default
		}
	]
});
