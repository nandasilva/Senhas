var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Empresas = mongoose.model('Empresas');
var Passwords = mongoose.model('Passwords');

// Formulário de cadastro de nova senha
router.get('/nova', function (req, res) {
	res.send(req.params);

	/*Empresas.findOne({
		_id: req.params.id
	}, function (err, e) {
		res.render('empresas/senhas/nova', {
			empresa: e,
			title: 'Cadastrar Senha | ' + e.nome
		});
	});*/
});


module.exports = router;