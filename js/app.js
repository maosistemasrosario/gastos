var app = angular.module("gastosApp", ["ngRoute","gastosControllerModule"]);

app.config(function($routeProvider) {
	$routeProvider
		.when("/", {
			templateUrl:"views/home.html",
			controller: "homeController"
		})
		.when("/conceptos", {
			templateUrl:"views/conceptos.html",
			controller: "listaConceptosController"
		})
		.when("/concepto/nuevo", {
			templateUrl:"views/concepto.html",
			controller: "listaConceptosController"
		})
		.when("/concepto/edit/:id", {
			templateUrl:"views/concepto.html",
			controller: "listaConceptosController"
		})
		.when("/gastos", {
			templateUrl:"views/gastos.html",
			controller: "gastosController"
		})
		.otherwise({
			redirectTo: "/"
		});
});

app.controller("homeController", ["$scope", function($scope) {
	$scope.titulo = "Gastos";
}]);

app.service("conceptoService", function($http) {
	var conceptoService = {};

	conceptoService.conceptos = [];

	$http.get("data/conceptos.json")
	.success(function(data) {
		conceptoService.conceptos = data;
	})
	.error(function(data, status) {
		var error = {"id":null,"nombre":"Ocurrió un error al consultar los conceptos. Status: "+status}
		conceptoService.conceptos.push(error);
	});

	conceptoService.buscarConceptoPorId = function(id) {
		for (var i=0;i<conceptoService.conceptos.length;i++) {
			var concep = conceptoService.conceptos[i];
			if (concep.id == id) 
				return concep;
		}
	}

	conceptoService.agregarConcepto = function(nombre) {
		$http.post("data/nuevoConcepto.json", nombre)
		.success(function(data) {
			//var nuevo = {id: conceptoService.getNuevoId(), nombre: nombre};
			var nuevo = {id: data.nuevoId, nombre: nombre};
			conceptoService.conceptos.push(nuevo);
		})
		.error(function(data, status) {
			return "Error al agregar el concepto";
		}); 
		
	};

	conceptoService.actualizarConcepto = function(concepto) {
		var actual = conceptoService.buscarConceptoPorId(concepto.id);
		if (actual) {
			$http.post("data/conceptoActualizado.json", concepto)
			.success(function(data) {
				if (!data.error) {
					actual.id = concepto.id;
					actual.nombre = concepto.nombre;
				} else {
					return data.message;
				}
			})
			.error(function(data, status) {

			});
		}
	};

	conceptoService.getNuevoId = function() {
		if (conceptoService.nuevoId) {
			conceptoService.nuevoId++;
			return conceptoService.nuevoId;
		} else {
			var max = 0;
			for (i=0;i<conceptoService.conceptos.length;i++) {
				if (conceptoService.conceptos[i].id>max) {
					max = conceptoService.conceptos[i].id;
				}
			}
			conceptoService.nuevoId = ++max;
			return conceptoService.nuevoId;
		}
	}

	conceptoService.eliminarConcepto = function(concepto) {
		$http.post("data/conceptoEliminado.json",concepto)
		.success(function(data) {
			if (!data.error) {
				var index = conceptoService.conceptos.indexOf(concepto);
				conceptoService.conceptos.splice(index, 1);
			} else {
				return data.mensaje;
			}
		})
		.error(function(data,status) {
			return "Ocurrió un error al intentar eliminar. Status: "+status;
		});
	}

	return conceptoService;
});

app.controller("listaConceptosController", ["$scope", "$routeParams", "$location", "conceptoService", function($scope, $routeParams, $location, conceptoService) {
	$scope.conceptos = conceptoService.conceptos;

	if (!$routeParams.id) {
		$scope.current = {
			id: "",
			nombre: ""
		};
	} else {
		var concepto = conceptoService.buscarConceptoPorId(parseInt($routeParams.id));
		$scope.current = {
			id: concepto.id,
			nombre: concepto.nombre
		}
	}

	$scope.guardarConcepto = function() {
		if ($scope.current.id) {
			conceptoService.actualizarConcepto($scope.current);
		} else {
			var error = conceptoService.agregarConcepto($scope.current.nombre);
			if (error) alert(error);
		}
		$location.path("/conceptos");
	}

	$scope.eliminarConcepto = function(concepto) {
		if (confirm('¿Esta seguro que desea eliminar el concepto?')) {
			conceptoService.eliminarConcepto(concepto);
		}
	}

	$scope.$watch(function() {return conceptoService.conceptos}, function(conceptos) {$scope.conceptos = conceptos});
}]);


app.directive("conceptoItem", function() {
	return {
		restrict: "E",
		templateUrl: "views/conceptoItem.html"
	}
});

app.directive("gastoItem", function() {
	return {
		restrict: "E",
		templateUrl: "views/gastoItem.html"
	}
});