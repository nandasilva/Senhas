var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Empresas = mongoose.model('Empresas');
var Passwords = mongoose.model('Passwords');


/* GET home page. */
router.get('/', function(req, res) {
	Empresas.find(function (err, empresas) {
		res.render('index', {
			empresas: empresas,
			title: 'Empresas'
		});
	});
});

router.get('/nova', function (req, res) {
	res.render('empresas/nova', {
		title: 'Cadastrar Empresa'
	});
});

// Resgata 1 empresa
router.get('/:id', function (req, res) {
	Empresas.findOne({
		_id: req.params.id
	})
	.exec(function (err, empresa) {
		Passwords
			.find({
				empresa: empresa._id
			})
			.sort('nome')
			.sort('type')
			.exec(function (err, senhas) {
				res.render('empresas/empresa', {
					e: empresa,
					senhas: senhas,
					title: 'Empresa | ' + empresa.nome
				});
			});
	});
});

// Cadastrar uma nova empresa no banco
router.post('/', function (req, res) {

	// Atualiza imagem
	req.body.logo = req.files.logo;

	new Empresas(req.body)
		.save(function (err, e) {
			if (!err) {
				res.redirect('/');
			}
		});
});

// Exibe formulário para edição
router.get('/:id/editar', function (req, res) {
	Empresas.findOne({
		_id: req.params.id
	}, function (err, e) {
		res.render('empresas/editar', {
			empresa: e,
			title: 'Editar | ' + e.nome
		});
	});
});

// Edita uma empresa no banco
router.post('/:id', function (req, res) {
	// Atualiza imagem
	if (req.files.logo.size) {
		req.body.logo = req.files.logo;
	}

	Empresas
		.update({
			_id: req.params.id
		}, req.body)
		.exec(function () {
			req.flash('ok', 'A empresa <strong>' + req.body.nome + '</strong> foi editada!');
			res.redirect('/empresas/' + req.params.id);
		});
});


/**
 * Deletar uma empresa do banco
 */
router.get('/:id/excluir', function (req, res) {
	Empresas.findOne({
		_id: req.params.id
	}, function (err, e) {
		if (!err) {
			Empresas
				.remove({
					_id: req.params.id
				})
				.exec(function (err) {
					if (!err) {
						req.flash('ok', 'Empresa removida!');
						res.redirect('/');
					}
				});
		}
	});
});


/**
 * Senhas
 */

// Formulário de cadastro de nova senha
router.get('/:id/senhas/nova', function (req, res) {
	Empresas.findOne({
		_id: req.params.id
	}, function (err, e) {
		res.render('empresas/senhas/nova', {
			empresa: e,
			title: 'Cadastrar Senha | ' + e.nome
		});
	});
});

router.post('/:id/senhas', function (req, res) {
	req.body.empresa = req.params.id;

	new Passwords(req.body)
			.save(function (e, password) {
				res.redirect('/empresas/' + req.params.id);
			});
});




module.exports = router;