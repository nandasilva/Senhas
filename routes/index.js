var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Empresas = mongoose.model('Empresas');

/* GET home page. */
router.get('/', function(req, res) {
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
