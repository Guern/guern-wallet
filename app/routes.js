var Amounts = require('./models/amounts');

module.exports = function(app) {

	var that = this;
	this.total = 0;
	this.currency = '£';
	
	// currency change
	// the total is always the amount in £.
	// TODO: users could be able change these
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
			
			that.updateTotal(amounts);
			res.json({amounts: amounts, total: that.total, currency: that.currency, change: change}); // return all amounts in JSON format
		});
	});

	// create amount and send back all amounts after creation
	app.post('/api/amounts', function(req, res) {

		// create an amount, information comes from AJAX request from Angular
		Amounts.create({
			amount: req.body.amount,
			currency : req.body.currency,
			date : req.body.date,
			done : false
		}, function(err, amount) {
			if (err)
				res.send(err);
				
			// get and return all the amounts after you create another
			Amounts.find(function(err, amounts) {
				if (err)
					res.send(err);
				
				that.updateTotal(amounts);
				res.json({amounts: amounts, total: that.total, currency: that.currency, change: change}); // return all amounts in JSON format
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
	
	this.updateTotal = function(amounts) {
		this.total = 0;
		
		if (!amounts)
			return;

		for (var a in amounts)
			this.total += amounts[a].amount * change[amounts[a].currency];
			
		var l = amounts.length;
		this.currency = (l > 0)? amounts[--l].currency : '£';
	}
};