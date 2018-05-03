var test = require("tape");
var WSCredentials = require("../lib/WSCredentials");
var koa = require("koa");
var https = require('https');
var fs = require('fs');
var path = require('path');

var TESTING_PORT = 4433;
var BASE_URL = 'https://localhost';

var credentials = WSCredentials(BASE_URL, TESTING_PORT, path.join(__dirname, 'certs', 'client', 'my-private-root-ca.cert.pem'));
var credentialsNoCert = WSCredentials(BASE_URL, TESTING_PORT);
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

test("SSLWSCredentials - [BEFORE] Start Koa server", assert => {
  var options = {
    key: fs.readFileSync(path.join(__dirname, 'certs', 'server', 'privkey.pem')),
    ca: fs.readFileSync(path.join(__dirname, 'certs', 'server', 'my-private-root-ca.cert.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'certs', 'server', 'fullchain.pem'))
  }
  server = https.createServer(options, app.callback()).listen(TESTING_PORT);
  assert.end();
});

test("SSLWSCredentials - authenticate OK with certificate", function (assert) {
  assert.plan(1);
  credentials.authenticate(USERNAME, PASSWORD).then(function (userDetails) {
    assert.deepEqual(userDetails, mockDetails, "The expected user details");
  }).catch(function (err) {
    assert.fail(JSON.stringify(err));
  });
});

test("SSLWSCredentials - authenticate OK without certificate", function (assert) {
  assert.plan(1);
  credentialsNoCert.authenticate(USERNAME, PASSWORD).then(function (userDetails) {
    assert.deepEqual(userDetails, mockDetails, "The expected user details");
  }).catch(function (err) {
    assert.fail(JSON.stringify(err));
  });
});

test("SSLWSCredentials - authenticate inexistent username", assert => {
  assert.plan(1);
  mockResponse.authenticate = "false";
  credentials.authenticate(USERNAME, PASSWORD).then(function (res) {
    assert.fail("Should not get a response");
  }).catch(function (err) {
    assert.equal(err.message, "Wrong username or password");
  });
});

test("SSLWSCredentials - authenticate wrong password", assert => {
  assert.plan(1);
  mockResponse.authenticate = "false";
  credentials.authenticate(USERNAME, PASSWORD).then(function (res) {
    assert.fail("Should not get a response");
  }).catch(function (err) {
    assert.equal(err.message, "Wrong username or password");
  });
});

test("SSLWSCredentials - don't log passwords", function (assert) {
  assert.plan(1);
  var wrongPassword = "wrong-password-leaked";  
  credentials.authenticate(USERNAME, wrongPassword).then(function (res) {
    assert.fail("Shouldn't authenticate with this password");
  }).catch(function (err) {
    assert.ok(err.message.indexOf(wrongPassword) < 0, "Shouldn't show password");
  });
});

test("SSLWSCredentials - groups", function (assert) {
  assert.plan(1);
    credentials.groups(USERNAME).then(function (groups) {
    assert.deepEqual(groups, mockDetails.MemberOf, "The groups the user is member of");
  }).catch(function (err) {
    assert.fail(err.message);
  });
});

test("SSLWSCredentials - [AFTER] Close Koa server", assert => {
  server.close();
  assert.end();
});
