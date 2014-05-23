var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Empresas = mongoose.model('Empresas');
var Passwords = mongoose.model('Passwords');


router.get('/nova', function (req, res) {
	res.render('empresas/nova');
});

// Resgata 1 empresa
router.get('/:id', function (req, res) {
	Empresas.findOne({
		_id: req.params.id
	})
	.sort({tipo: -1})
	.exec(function (err, empresa) {
		Passwords.find({
			empresa: empresa._id
		})
		.exec(function (err, senhas) {
			res.render('empresa', {
				e: empresa,
				senhas: senhas
			});
		});
	});
});

router.post('/', function (req, res) {
	new Empresas(req.body)
		.save(function (err, e) {
			if (!err) {
				res.redirect('/');
			}
		});
});

// Formulário de cadastro de nova senha
router.get('/:id/senhas/nova', function (req, res) {
	Empresas.findOne({
		_id: req.params.id
	}, function (err, e) {
		res.render('empresas/senhas/nova', {
			empresa: e
		});
	});
});

module.exports = router;