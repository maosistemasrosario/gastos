var gastosControllerModule = angular.module("gastosControllerModule", [])

gastosControllerModule.service("gastoService", function($http) {

	var gastoService = {};

	gastoService.gastos = [{
		id:1,
		concepto:"Compras Super",
		tipo:"Egreso",
		importe: 350
	}];

	return gastoService;

});

gastosControllerModule.controller("gastosController", ["$scope", "gastoService", function($scope, gastoService) {
	$scope.gastos = gastoService.gastos;

	$scope.$watch(function() {return gastoService.gastos}, function(gastos) {$scope.gastos = gastos});
}]);
