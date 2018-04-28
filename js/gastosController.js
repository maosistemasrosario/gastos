var gastosControllerModule = angular.module("gastosControllerModule", [])

gastosControllerModule.service("gastoService", function($http) {

	var gastoService = {};

	gastoService.gastos = [];

	$http.get("data/gastos.json")
	.success(function(data) {
		for (var i=0;i<data.length;i++) {
			var item = data[i];
			var n = {
				id:item.id,
				fecha: new Date(item.fecha),
				concepto: item.concepto,
				tipo: item.tipo,
				importe: item.importe
			}
			gastoService.gastos.push(n);	
		}
	})
	.error(function(data, status) {
		var error = {id:null,concepto:"Ocurrió un error al consultar los gastos. Status: "+status};
		gastoService.gastos.push(error);
	});

	return gastoService;

});

gastosControllerModule.controller("gastosController", ["$scope", "gastoService", function($scope, gastoService) {
	$scope.gastos = gastoService.gastos;
	$scope.timezone = "-0000"; //Para que no haga conversión sino que tome la fecha tal cual viene del json
	$scope.$watch(function() {return gastoService.gastos}, function(gastos) {$scope.gastos = gastos});
}]);
