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
	var product_display_name = 'newproductid';
	var product_owner = 'steve123';
	var password = 'test123';
	var api_key;
	var license_hash;

	step('allows creation of a user', function(done) {
		superagent.post("http://localhost:8080/user/register")
			.send({'email':product_owner, 'password': password})
			.end(function(err, res) {
				assert.ifError(err);

				var result = JSON.parse(res.text);
				assert(result.api_key);

				api_key = result.api_key;

				done();
			});
	});
	step('allows creation of a product', function(done) {
		superagent.post("http://localhost:8080/product/register")
			.send({'product_id':product_id, 'display_name': product_display_name, 'api_key':api_key})
			.end(function(err, res) {
				assert.ifError(err);

				var result = JSON.parse(res.text);

				assert(result.product_id);
				assert(result.display_name);

				assert(result.product_id === product_id);
				assert(result.display_name === product_display_name);

				done();
			});
	});
	step('allows registration of a license with the product_id and api_key', function(done) {
		superagent.post("http://localhost:8080/license/register")
			.send({'api_key':api_key, 'product_id':product_id})
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
	var bad_api_key = 'foo';
	var bad_license = 'bar';
	var bad_product_id = 'no mans sky'

	it('disallows registration of a license with invalid keys', function(done) {
		superagent.post("http://localhost:8080/license/register")
			.send({'api_key':bad_api_key, 'product_id':bad_product_id})
			.end(function(err, res) {
				assert.ifError(err);

				var result = JSON.parse(res.text);
				assert(result.error);
				assert(result.error === 'No user found with that api key');
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
				console.log(result.error);
				assert(result.error === 'Invalid params');
				done();
			});
	});
});
