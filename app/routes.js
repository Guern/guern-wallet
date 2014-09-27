var Amounts = require('./models/amounts');
var Wallet = require('./models/wallet');

module.exports = function(app) {

	var that = this;
	this.total = 0;
	this.currency = '£';
	
	// currency change
	// the total is always the amount in £.
	var change = {
		'£': 1,
		'€': 0.781,
		'$': 0.616
	}
	
	// api ---------------------------------------------------------------------
	// get all amounts
	app.get('/api/amounts', function(req, res) {

		// use mongoose to get all amounts in the database
		Amounts.find(function(err, amounts) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)

			res.json({amounts: amounts, total: that.total, currency: that.currency}); // return all amounts in JSON format
		});
	});

	// create amount and send back all amounts after creation
	app.post('/api/amounts', function(req, res) {

		// create an amount, information comes from AJAX request from Angular
		Amounts.create({
			amount: req.body.amount,
			currency : req.body.currency,
			done : false
		}, function(err, amount) {
			if (err)
				res.send(err);
				
			that.updateTotal(amount);

			// get and return all the amounts after you create another
			Amounts.find(function(err, amounts) {
				if (err)
					res.send(err)
					
				res.json({amounts: amounts, total: that.total, currency: that.currency}); // return all amounts in JSON format
			});
		});

	});

	// delete an amount
	app.delete('/api/amounts/', function(req, res) {
		Amounts.remove({}, function(err, amount) {
			if (err)
				res.send(err);
		});
		
		that.total = 0;
		that.currency = '£';
		res.json({amounts: {}, total: 0, currency: '£'});
	});

	// application -------------------------------------------------------------
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
	
	this.updateTotal = function(amount) {
		if (amount && typeof(amount.amount) == "number") {
			this.total += amount.amount * change[amount.currency];
			this.currency = amount.currency;
		}
	}
};