var mongoose = require('mongoose');

module.exports = mongoose.model('Amounts', {
	amount : {type :  Number, default: 0},
	currency : {type : String, default: '£'}
});