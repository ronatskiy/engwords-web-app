import angular from "angular";
import "angular-resource";
import "angular-route";

const memorizeApp = angular.module("memorizeApp", ["ngRoute", "ngResource"]);

memorizeApp.config([
	"$routeProvider",
	"$locationProvider",
	function($routeProvider, $locationProvider) {
		$routeProvider
			.when("/", {
				template: require("../views/start-page.html"),
				controller: "startPageCtrl",
			})
			.when("/list/:type/", {
				template: require("../views/list-view.html"),
				controller: "listCtrl",
			})

			.when("/detail-view/:id", {
				template: require("../views/detail-view.html"),
				controller: "detailViewCtrl",
			})
			.when("/learning/:id/:type", {
				template: require("../views/learning.html"),
				controller: "learningCtrl",
			})
			.when("/irregular-verbs", {
				template: require("../views/detail-view.html"),
				controller: "irregularVerbsCtrl",
			})
			.otherwise({
				redirectTo: "/",
			});
	},
]);

export default memorizeApp;
