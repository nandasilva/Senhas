(function () {

var app = angular.module('App', []);

app.controller('AppController', function ($scope) {

	// Quando clicar em 'excluir'
	var excluir = $('.excluir');

	excluir.on('click', function (e) {
		var c = confirm('Você deseja excluir?');

		if (!c)
			e.preventDefault();
	});

	/**
	 * Table sorter
	 */
	$('.table').tablesorter();

});

})();