var mongoose = require('mongoose');

module.exports = mongoose.model('Amounts', {
	amount : {name: 'amount', type :  Number, default: 0},
	currency : {name: 'currency', type : String, default: '£'},
	date : {name: 'date', type : String, default: ''}
});