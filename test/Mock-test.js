const test = require("tape");
const Mock = require("../lib/Mock");

const USERNAME = "username";
const PASSWORD = "password";

const mock = Mock({[USERNAME]: PASSWORD});

test("Mock - authenticate OK", assert => {
	assert.plan(1);
	mock.authenticate(USERNAME, PASSWORD).then(res => {
		assert.pass("Got some response");
	}).catch(err => assert.fail(err));
});

test("Mock - wrong credentials", assert => {
	assert.plan(1);
	mock.authenticate("invalid", "invalid").then(res => {
		assert.fail("Should not be here");
	}).catch(err => assert.equal(err.code, 401, "Unauthorized"));
});
