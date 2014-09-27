var mongoose = require('mongoose');

module.exports = mongoose.model('Wallet', {
	text : {type : String, default: ''},
	amount : {type :  Number, default: 0}
});