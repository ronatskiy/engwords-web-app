"use strict";

var memorizeApp = angular.module("memorizeApp", ["ngRoute", "ngResource"]);
memorizeApp.config([
	"$routeProvider",
	"$locationProvider",
	function($routeProvider, $locationProvider) {
		$routeProvider
			.when("/", {
				templateUrl: "views/start-page.html",
				controller: "startPageCtrl",
			})
			.when("/list/:type/", {
				templateUrl: "views/list-view.html",
				controller: "listCtrl",
			})

			.when("/detail-view/:id", {
				templateUrl: "views/detail-view.html",
				controller: "detailViewCtrl",
			})
			.when("/learning/:id/:type", {
				templateUrl: "views/learning.html",
				controller: "learningCtrl",
			})
			.when("/irregular-verbs", {
				templateUrl: "views/detail-view.html",
				controller: "irregularVerbsCtrl",
			})
			.otherwise({
				redirectTo: "/",
			});
	},
]);
