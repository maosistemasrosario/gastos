var gastosControllerModule = angular.module("gastosControllerModule", [])

gastosControllerModule.service("gastoService", function($http) {

	var gastoService = {};

	gastoService.gastos = [];

	$http.get("data/gastos.json")
	.success(function(data) {
		for (var i=0;i<data.detalle.length;i++) {
			var item = data.detalle[i];
			var n = {
				id:item.id,
				fecha: new Date(item.fecha),
				concepto: item.concepto,
				tipo: item.tipo,
				egreso: item.tipo=='Egreso'?item.importe:null,
				ingreso: item.tipo=='Ingreso'?item.importe:null,
			}
			gastoService.gastos.push(n);	
		}
		var total = {
			id:null,
			fecha: new Date("2999-12-31"),
			concepto: {
				id:null,
				nombre:"Totales"
			},
			tipo:"Total",
			egreso:data.totalEgresos,
			ingreso:data.totalIngresos
		};
		gastoService.gastos.push(total);
	})
	.error(function(data, status) {
		var error = {id:null,concepto:"Ocurrió un error al consultar los gastos. Status: "+status};
		gastoService.gastos.push(error);
	});

	gastoService.buscarGastoPorId = function(id) {
		for (var i=0;i<gastoService.gastos.length;i++) {
			var gasto = gastoService.gastos[i];
			if (gasto.id == id) 
				return gasto;
		}
	}

	gastoService.agregarGasto = function(gasto) {
		$http.post("data/nuevoGasto.json", gasto)
		.success(function(data) {
			//var nuevo = {id: conceptoService.getNuevoId(), nombre: nombre};
			var nuevo = {
				id:data.nuevoId,
				fecha: gasto.fecha,
				concepto: gasto.concepto,
				tipo: gasto.tipo,
				egreso: gasto.tipo=='Egreso'?gasto.importe:null,
				ingreso: gasto.tipo=='Ingreso'?gasto.importe:null,
			}
			gastoService.gastos.push(nuevo);
		})
		.error(function(data, status) {
			return "Error al agregar el gasto";
		}); 
		
	};

	gastoService.actualizarGasto = function(gasto) {
		var actual = gastoService.buscarGastoPorId(gasto.id);
		if (actual) {
			$http.post("data/gastoActualizado.json", gasto)
			.success(function(data) {
				if (!data.error) {
					actual.id = gasto.id;
					actual.fecha = gasto.fecha;
					actual.concepto = gasto.concepto;
					actual.tipo = gasto.tipo;
					actual.egreso = (gasto.tipo=='Egreso')?gasto.importe:null;
					actual.ingreso = (gasto.tipo=='Ingreso')?gasto.importe:null;
				} else {
					return data.message;
				}
			})
			.error(function(data, status) {

			});
		}
	};


	return gastoService;

});

gastosControllerModule.controller("gastosController", ["$scope", "$routeParams", "$location", "gastoService", "conceptoService", function($scope, $routeParams, $location, gastoService, conceptoService) {
	$scope.gastos = gastoService.gastos;
	$scope.conceptos = conceptoService.conceptos;

	if (!$routeParams.id) {
		$scope.current = {
			id: "",
			fecha: new Date()
		};
	} else {
		var gasto = gastoService.buscarGastoPorId(parseInt($routeParams.id));
		var c = conceptoService.buscarConceptoPorId(parseInt(gasto.concepto.id));
		$scope.current = {
			id: gasto.id,
			fecha: gasto.fecha,
			concepto: c,
			tipo: gasto.tipo,
			importe: gasto.tipo=='Egreso'?gasto.egreso:gasto.ingreso
		}
	}

	$scope.tipos = ["Egreso", "Ingreso"];
	$scope.timezone = "-0000"; //Para que no haga conversión sino que tome la fecha tal cual viene del json
	$scope.anio = (new Date()).getFullYear();
	$scope.anios = [];
	for (var i=0;i<120;i++) { //Hasta 120 años
		$scope.anios.push($scope.anio-i);
	}
	$scope.mes = 4;
	$scope.meses = [
		{value:1,name:"Enero"},
		{value:2,name:"Febrero"},
		{value:3,name:"Marzo"},
		{value:4,name:"Abril"},
		{value:5,name:"Mayo"},
		{value:6,name:"Junio"},
		{value:7,name:"Julio"},
		{value:8,name:"Agosto"},
		{value:9,name:"Septiembre"},
		{value:10,name:"Octubre"},
		{value:11,name:"Noviembre"},
		{value:12,name:"Diciembre"}
	];

	$scope.guardarGasto = function() {
		if ($scope.current.id) {
			gastoService.actualizarGasto($scope.current);
		} else {
			var error = gastoService.agregarGasto($scope.current);
			if (error) alert(error);
		}
		$location.path("/gastos");
	}

	$scope.$watch(function() {return gastoService.gastos}, function(gastos) {$scope.gastos = gastos});
	$scope.$watch(function() {return conceptoService.conceptos}, function(conceptos) {$scope.conceptos = conceptos});
}]);
