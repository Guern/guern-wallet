var mongoose = require('mongoose');

module.exports = mongoose.model('Wallet', {
	total : {name: 'total', type :  Number, default: 0},
	currency : {name: 'currency', type : String, default: '£'}
});