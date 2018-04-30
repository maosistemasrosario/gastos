var app = angular.module("gastosApp", ["ngRoute","gastosControllerModule","conceptosControllerModule"]);

app.config(function($routeProvider) {
	$routeProvider
		.when("/", {
			templateUrl:"views/home.html",
			controller: "homeController"
		})
		.when("/conceptos", {
			templateUrl:"views/conceptos.html",
			controller: "conceptosController"
		})
		.when("/concepto/nuevo", {
			templateUrl:"views/concepto.html",
			controller: "conceptosController"
		})
		.when("/concepto/edit/:id", {
			templateUrl:"views/concepto.html",
			controller: "conceptosController"
		})
		.when("/gastos", {
			templateUrl:"views/gastos.html",
			controller: "gastosController"
		})
		.when("/gasto/nuevo", {
			templateUrl:"views/gasto.html",
			controller: "gastosController"
		})
		.otherwise({
			redirectTo: "/"
		});
});

app.controller("homeController", ["$scope", function($scope) {
	$scope.titulo = "Gastos";
}]);


app.directive("conceptoItem", function() {
	return {
		restrict: "E",
		templateUrl: "views/conceptoItem.html"
	}
});

app.directive("gastoTable", function() {
	return {
		templateUrl: "views/gastoTable.html"
	}
});