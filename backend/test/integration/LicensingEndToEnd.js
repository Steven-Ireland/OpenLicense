var assert = require('assert');
var superagent = require('superagent');
var db = require('mongoose');


describe('License Flow', function() {
	before(function(done) {
		db.connect('mongodb://localhost/test', function() {
			db.connection.db.dropDatabase();
			done();
		});
	});

	var product_id = 'newProductId';
	var product_secret;
	var license_hash;
	step('allows creation of a product', function(done) {
		superagent.post("http://localhost:8080/product/register")
			.send({'product_id':product_id})
			.end(function(err, res) {
				assert.ifError(err);

				var result = JSON.parse(res.text);
				assert(result.product_id);
				assert(result.secret);

				assert(result.product_id === product_id);
				product_secret = result.secret;
				done();
			});
	});
	step('allows registration of a license with the secret', function(done) {
		superagent.post("http://localhost:8080/license/register")
			.send({'secret':product_secret})
			.end(function(err, res) {
				assert.ifError(err);

				var result = JSON.parse(res.text);
				assert(result.license);
				license_hash = result.license;
				done();
			});
	});
	step('allows a license with a valid product id and secret', function(done) {
		superagent.post("http://localhost:8080/license/check")
			.send({'product_id':product_id, 'license':license_hash})
			.end(function(err, res) {
				assert.ifError(err);
				assert('OK' === res.text);
				done();
			});
	});
});

describe('License Flow - Negative', function() {
	var bad_secret = 'foo';
	var bad_license = 'bar';
	var bad_product_id = 'no mans sky'

	it('disallows registration of a license with an incorrect secret', function(done) {
		superagent.post("http://localhost:8080/license/register")
			.send({'secret':bad_secret})
			.end(function(err, res) {
				assert.ifError(err);

				var result = JSON.parse(res.text);
				assert(result.error);
				assert(result.error === 'bad secret');
				done();
			});
	});
	it('disallows a license with an invalid product id or secret', function(done) {
		superagent.post("http://localhost:8080/license/register")
			.send({'product_id':bad_product_id, 'license':bad_license})
			.end(function(err, res) {
				assert.ifError(err);

				var result = JSON.parse(res.text);
				assert(result.error);
				assert(result.error === 'no supplied secret');
				done();
			});
	});
});
