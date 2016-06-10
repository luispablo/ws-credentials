var test = require("tape");
var Mock = require("../lib/Mock");

var users = [
	{ username: "tsmith", password: "pass", groups: ["TeamA", "TeamB"], details: { a: "b" } },
	{ username: "mtoms", password: "mpass", groups: ["TeamA", "TeamC"], details: { a: "c" } }
];

var credentials = Mock(users);

// var user1 = {
// 	username: "tsmith",
// 	password: "fakepass",
// 	groups: ["group1", "group2"],
// 	details: { ... }
// };
//
// var mock = credentials.Mock([user1, user2, ...]);

test("Mock - authenticate OK", assert => {
	assert.plan(1);
	credentials.authenticate(users[0].username, users[0].password).then(function (userDetails) {
		assert.deepEqual(userDetails, users[0].details, "The expected user details");
	}).catch(function (err) {
		assert.fail(JSON.stringify(err));
	});
});

test("Mock - wrong credentials", assert => {
	assert.plan(2);
	credentials.authenticate(users[0].username, "wrongpass").then(function (userDetails) {
		assert.fail("Should not get a response");
	}).catch(function (err) {
		assert.equal(err.code, 401, "HTTP Unauthorized");
		assert.equal(err.message, "Wrong username or password");
	});
});

test("Mock - details", function (assert) {
	assert.plan(1);
	credentials.details(users[0].username).then(function (userDetails) {
		assert.deepEqual(userDetails, users[0].details, "The expected user details");
	}).catch(function (err) {
		assert.fail(err.message);
	});
});

test("Mock - groups", function (assert) {
	assert.plan(1);
	credentials.groups(users[0].username).then(function (groups) {
		assert.deepEqual(groups, users[0].groups, "The groups the user is member of");
	}).catch(function (err) {
		assert.fail(err.message);
	});
});
