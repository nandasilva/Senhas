var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Empresas = mongoose.model('Empresas');
var Passwords = mongoose.model('Passwords');


/* GET home page. */
router.get('/', function(req, res) {
	// Lista todas as empresas
	Empresas.find(function (err, empresas) {
		// Renderiza a index
		res.render('index', {
			empresas: empresas,
			title: 'Empresas'
		});
	});
});

/**
 * /empresas/nova
 * Formulário para cadastrar uma nova empresa
 */
router.get('/nova', function (req, res) {
	res.render('empresas/nova', {
		title: 'Cadastrar Empresa'
	});
});

/**
 * /empresas/:id
 * Resgata uma empresa específica
 */
router.get('/:id', function (req, res) {
	// Procura uma empresa por um ID
	Empresas.findOne({
		_id: req.params.id
	})
	.exec(function (err, empresa) {
		// Se a empresa foi encontrada
		if (!err) {
			// Procura pelas senhas da empresa
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
		}
		else {
			req.flash('erro', 'Nenhuma empresa encontrada.');
			res.redirect('/');
		}
	});
});

/**
 * POST /empresas
 * Cadastrar uma nova empresa no banco
 */
router.post('/', function (req, res) {

	// Atualiza imagem para passar para o banco
	req.body.logo = req.files.logo;

	// Instancia nova empresa e passa
	// o corpo da request
	new Empresas(req.body)
		.save(function (err, e) {
			// Se inseriu...
			if (!err) {
				req.flash('ok', 'Empresa <strong>' + e.nome + '</strong> criada.');
				res.redirect('/empresas/' + e._id);
			}
			else {
				req.flash('erro', 'Não foi possível adicionar uma nova empresa, por favor, tente novamente.');
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
	var empresa = Empresas.findOne({
		_id: req.params.id
	}, function (err, e) {
		if (!err) {
			empresa
				.remove()
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

router.get('/:id/senhas/:senha/excluir', function (req, res) {

	var senhaExcluida = Passwords.findOne({
		_id: req.params.senha
	}, function (err, s) {
		if (!err) {
			senhaExcluida
				.remove()
				.exec(function (err) {
					req.flash('ok', 'Senha <strong>' + s.nome + '</strong> excluída.');
					res.redirect('/empresas/' + req.params.id);
				});
		}
		else {
			req.flash('erro', 'Nenhuma senha foi encontrada.');
			res.redirect('/empresas/' + req.params.id);
		}
	});
});



module.exports = router;