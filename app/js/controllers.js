"use strict";

function setTitle(routeParamId) {
	var titleField;
	switch (routeParamId) {
		case "irregular-verbs":
			titleField = "Неправильные Глаголы";
			break;
		case "inseparable-verbs":
			titleField = "Неразрывные фразовые глаголы";
			break;
		case "separable-verbs":
			titleField = "Разрывные фразовые глаголы";
			break;
	}
	if (routeParamId.startsWith("lesson-")) {
		titleField = "Урок № " + _.trimLeft(routeParamId, "lesson-");
	}

	return titleField;
}

function reloadProgress($scope) {
	$scope.progressWidthText = "width: " + getProgressWidth($scope.currWord, $scope.count).toString() + "%";
}

function getProgressWidth(currWord, wordCount) {
	return currWord + 1 / wordCount * 100;
}

function navigateButtonHandler($scope, hideTranslateHandler) {
	$scope.prev = function () {
		if (hideTranslateHandler) {
			hideTranslateHandler();
		}
		if ($scope.currWord > 0) {
			$scope.currWord = $scope.currWord - 1;
		}
		reloadProgress($scope);
	};

	$scope.next = function () {
		if (hideTranslateHandler) {
			hideTranslateHandler();
		}
		if ($scope.currWord < $scope.count - 1) {
			$scope.currWord = $scope.currWord + 1;
		}
		reloadProgress($scope);
	};
}

function initWords($scope, data) {
	$scope.words = data;
	$scope.count = $scope.words.length;
	reloadProgress($scope);
}

memorizeApp.factory("LessonsData", [
        "$resource", function ($resource) {
        	return $resource("store/:id.json", {});
        }]
);

memorizeApp.factory("IrregularVerbsData", [
        "$resource", function ($resource) {
        	return $resource("store/irregular-verbs.json", {});
        }]
);

memorizeApp.controller("mainCtrl", [
    "$scope",
    function ($scope) {
    	$scope.firstLesson = 15;
    	$scope.currLesson = $scope.firstLesson;
    	$scope.lessons = _.range($scope.firstLesson, 28);
    	$scope.main = {
    		isBrandNameShown: true,
    		firstLesson: $scope.firstLesson
    	};

    	$scope.exit = function () {
    		if ($scope.main.isBrandNameShown && navigator) {
    			// TODO: uncomment me in the cordoba app
    			// navigator.app.exitApp();
    		}
    	}
    }
]);

function BtnComponent(title, path, bgColor) {
	this.title = title;
	this.path = path;
	this.bgColor = bgColor;
}

memorizeApp.controller("startPageCtrl", [
    "$scope",
    function ($scope) {
    	$scope.title = "Привет!";
    	$scope.message = "Чем сегодня займёмся?";
    	$scope.sections = [
            new BtnComponent("Уроки", "#/list/lesson/", "btn-material-green btn-lg"),
            new BtnComponent("Тренировка", "#/list/training", "btn-material-light-blue btn-lg"),
            new BtnComponent("Разр. Фр. Глаголы", "#/detail-view/separable-verbs", "btn-material-cyan btn-lg"),
            new BtnComponent("Неразр. Фр. Глаголы", "#/detail-view/inseparable-verbs", "btn-material-indigo btn-lg"),
            new BtnComponent("Неправ. Глаголы", "#/irregular-verbs", "btn-material-light-green btn-lg")
    	];
    	$scope.main.isBrandNameShown = true;
    }
]);

memorizeApp.controller("detailViewCtrl", [
    "$scope", "$routeParams", "LessonsData",
    function ($scope, $routeParams, LessonsData) {
    	$scope.main.isBrandNameShown = false;

    	var storeFileId = $routeParams.id,
        btn1Path = "",
        btn2Path = "";

    	$scope.title = setTitle(storeFileId);

    	btn1Path = "#/learning/" + storeFileId + "/learn";
    	btn2Path = "#/learning/" + storeFileId + "/training";

    	$scope.sections = [
            new BtnComponent("Учить!", btn1Path, "btn-warning btn-lg"),
            new BtnComponent("Тренировать", btn2Path, "btn-info btn-lg")
    	];

    	LessonsData.query({ id: storeFileId }, function (data) {
    		$scope.words = data;
    		$scope.message = "Слов на сегодня " + $scope.words.length;
    	});
    }
]);

memorizeApp.controller("irregularVerbsCtrl", [
    "$scope", "$routeParams", "IrregularVerbsData",
    function ($scope, $routeParams, IrregularVerbsData) {
    	$scope.main.isBrandNameShown = false;

    	var btn1Path = "", btn2Path = "";

    	$scope.title = "Неправильные Глаголы";

    	btn1Path = "#/learning/irregular-verbs/learn";
    	btn2Path = "#/learning/irregular-verbs/training";

    	$scope.sections = [
            new BtnComponent("Учить!", btn1Path, "btn-warning btn-lg"),
            new BtnComponent("Тренировать", btn2Path, "btn-info btn-lg")
    	];

    	IrregularVerbsData.query({}, function (data) {
    		$scope.words = data.map(function (elem) {
    			return {
    				Ru: elem.Ru,
    				Eng: elem["form 1"] + ", " + elem["form 2"] + ", " + elem["form 3"]
    			}
    		});

    		$scope.message = "Слов на сегодня " + $scope.words.length;
    	});
    }
]);

memorizeApp.controller("listCtrl", [
    "$scope", "$routeParams",
    function ($scope, $routeParams) {
    	$scope.main.isBrandNameShown = false;
    	$scope.title = "Список уроков";
    	$scope.message = "Выбирай, что сегодня выучим";
    	var type = $routeParams.type;

    	if (type === "lesson" || type === "training") {
    		$scope.sections = [];
    		_.map($scope.lessons, function (elem) {
    			$scope.sections.push(new BtnComponent(
				 "Урок " + elem,
				 type === "lesson" ? "#/detail-view/lesson-" + elem : "#/learning/lesson-" + elem + "/training",
				 type === "lesson" ? "btn-material-green btn-lg" : "btn-material-light-blue btn-lg"));
    		});
    	}
    }
]);

memorizeApp.controller("learningCtrl", [
    "$scope", "$routeParams", "LessonsData", "IrregularVerbsData",
    function ($scope, $routeParams, LessonsData, IrregularVerbsData) {
    	var storeFileId = $routeParams.id,
			type = $routeParams.type;

    	$scope.main.isBrandNameShown = false;
    	$scope.title = setTitle(storeFileId);
    	$scope.count = 0;
    	$scope.currWord = $scope.count;
    	reloadProgress($scope);

    	if (storeFileId === "irregular-verbs") {
    		IrregularVerbsData.query({}, function (data) {
    			initWords($scope, data.map(function (elem) {
    				return {
    					Ru: elem.Ru,
    					Eng: elem["form 1"] + ", " + elem["form 2"] + ", " + elem["form 3"]
    				}
    			}));
    		});
    	} else {
    		LessonsData.query({ id: storeFileId }, function (data) {
    			initWords($scope, data);
    		});
    	}

    	switch (type) {
    		case "learn":
    			$scope.isShown = true;
    			navigateButtonHandler($scope);
    			break;
    		case "training":
    			$scope.isShown = false;
    			navigateButtonHandler($scope, function () {
    				$scope.isShown = false;
    			});
    			$scope.show = function () {
    				$scope.isShown = !$scope.isShown;
    			};
    			break;
    	}
    }
]);