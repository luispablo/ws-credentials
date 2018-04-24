var test = require("tape");
var WSCredentials = require("../lib/WSCredentials");
var koa = require("koa");

var TESTING_PORT = 7928;
var BASE_URL = `http://localhost:${TESTING_PORT}`;

var credentials = WSCredentials(BASE_URL);
var app = koa();

var server;
var USERNAME = "tsmith";
var PASSWORD = "password";
var mockDetails = {
  CN: "Tom Smith",
  Description: null,
  DisplayName: "Tom Wilson Smith",
  GivenName: "Tom",
  GroupType: null,
  HomeDirectory: "\\SVRSOME\HOME\tsmith",
  Mail: "tsmith@svrhome.com",
  MailNickname: USERNAME,
  MemberOf: ["PaperCut", "OtherGroup"],
  Name: "Tom Wilson Smith",
  SAMAccountName: USERNAME,
  Surname: "Smith",
  WhenChanged: "6/5/2016 12:00:26 PM",
  WhenCreated: "8/31/2010 5:54:10 PM"
};

var mockResponse = { details: JSON.stringify(mockDetails), authenticate: "true", groups: mockDetails.MemberOf };

app.use(function *() {
  if (this.path === "/entry/"+ USERNAME +"/json") this.body = mockResponse.details;
  else if (this.path === "/json/"+ USERNAME +"/"+ PASSWORD) this.body = mockResponse.authenticate;
  else if (this.path === "/entry/"+ USERNAME +"/json") this.body = mockResponse.groups;
});

test("WSCredentials - [BEFORE] Start Koa server", assert => {
  server = app.listen(TESTING_PORT);
  assert.end();
});

test("WSCredentials - details", function (assert) {
  assert.plan(1);
  credentials.details(USERNAME).then(function (userDetails) {
    assert.deepEqual(userDetails, mockDetails, "The expected user details");
  }).catch(function (err) {
    assert.fail(err.message);
  });
});

test("WSCredentials - authenticate OK", function (assert) {
  assert.plan(1);
  credentials.authenticate(USERNAME, PASSWORD).then(function (userDetails) {
    assert.deepEqual(userDetails, mockDetails, "The expected user details");
  }).catch(function (err) {
    assert.fail(JSON.stringify(err));
  });
});

test("WSCredentials - authenticate inexistent username", assert => {
  assert.plan(1);
  mockResponse.authenticate = "false";
  credentials.authenticate(USERNAME, PASSWORD).then(function (res) {
    assert.fail("Should not get a response");
  }).catch(function (err) {
    assert.equal(err.message, "Wrong username or password");
  });
});

test("WSCredentials - authenticate wrong password", assert => {
  assert.plan(1);
  mockResponse.authenticate = "false";
  credentials.authenticate(USERNAME, PASSWORD).then(function (res) {
    assert.fail("Should not get a response");
  }).catch(function (err) {
    assert.equal(err.message, "Wrong username or password");
  });
});

test("WSCredentials - don't log passwords", function (assert) {
  assert.plan(1);
  var wrongPassword = "wrong-password-leaked";  
  credentials.authenticate(USERNAME, wrongPassword).then(function (res) {
    assert.fail("Shouldn't authenticate with this password");
  }).catch(function (err) {
    assert.ok(err.message.indexOf(wrongPassword) < 0, "Shouldn't show password");
  });
});

test("WSCredentials - groups", function (assert) {
  assert.plan(1);
    credentials.groups(USERNAME).then(function (groups) {
    assert.deepEqual(groups, mockDetails.MemberOf, "The groups the user is member of");
  }).catch(function (err) {
    assert.fail(err.message);
  });
});

test("WSCredentials - [AFTER] Close Koa server", assert => {
  server.close();
  assert.end();
});
