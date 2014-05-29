var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Empresas = mongoose.model('Empresas');

/**
 * GET /
 * Página principal, lista as empresas cadastradas
 */
router.get('/', function(req, res) {
	// Lista todas as empresas e ordena por nome
	Empresas
		.find()
		.sort('nome')
		.exec(function (err, empresas) {
			res.render('index', {
				empresas: empresas,
				title: 'Empresas'
			});
		});
});

module.exports = router;
