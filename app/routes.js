var Wallet = require('./models/wallet');
var total = 0;

module.exports = function(app) {

	// api ---------------------------------------------------------------------
	// get all amounts
	app.get('/api/amounts', function(req, res) {

		// use mongoose to get all amounts in the database
		Wallet.find(function(err, amounts) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)

			res.json({amounts: amounts, total: total}); // return all amounts in JSON format
		});
	});

	// create amount and send back all amounts after creation
	app.post('/api/amounts', function(req, res) {

		// create an amount, information comes from AJAX request from Angular
		Wallet.create({
			//text : req.body.text,
			amount: req.body.amount,
			done : false
		}, function(err, amount) {
			if (err)
				res.send(err);
				
			// update the total
			total += amount.amount;

			// get and return all the amounts after you create another
			Wallet.find(function(err, amounts) {
				if (err)
					res.send(err)
				res.json({amounts: amounts, total: total});
			});
		});

	});

	// delete an amount
	app.delete('/api/amounts/:amount_id', function(req, res) {
		Wallet.remove({
			_id : req.params.amount_id
		}, function(err, amount) {
			if (err)
				res.send(err);

			// get and return all the amounts after you create another
			Wallet.find(function(err, amounts) {
				if (err)
					res.send(err)
				res.json({amounts: amounts, total: total});
			});
		});
	});

	// application -------------------------------------------------------------
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
};