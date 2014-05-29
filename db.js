var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var options = {
	versionKey: false
}

// PassWords
var PasswordsSchema = new Schema({
	nome: { type: String, default: '' },
	link: { type: String, default: '' },
	login: { type: String, default: '' },
	password: { type: String, default: '' },
	type: { type: String, default: '' },
	outros: { type: String, default: '' },
	empresa: { type: Schema.Types.ObjectId, ref: 'Empresas' },
}, options);


// Empresas
var EmpresasSchema = new Schema({
	nome: { type: String, default: '' },
	link: { type: String, default: '' },
	logo: Schema.Types.Mixed,
	telefone: { type: String, default: '' },
}, options);


// Models
mongoose.model('Passwords', PasswordsSchema);
mongoose.model('Empresas', EmpresasSchema);

// Connect on mongodb
mongoose.connect('mongodb://localhost:27017/passwords');