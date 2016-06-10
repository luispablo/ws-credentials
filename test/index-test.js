var test = require("tape");
var WSCredentials = require("../lib/WSCredentials");
var Mock = require("../lib/Mock");
var index = require("../index");

test("index - module.exports", function (assert) {
	assert.equal(index, WSCredentials, "The default export is WSCredentials");
	assert.equal(index.Mock, Mock, "The Mock is also exported");
	assert.end();
});
