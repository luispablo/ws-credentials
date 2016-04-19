"use strict";

const TESTING_PORT = 7928;
const BASE_URL = `http://localhost:${TESTING_PORT}`;

const fetch = require("isomorphic-fetch");
const test = require("tape");
const koa = require("koa");
const app = koa();
const WSCredentials = require("../index");
const credentials = WSCredentials(BASE_URL);
const mockResponse = {};

app.use(function *() {
	this.body = mockResponse.body;
});

const buildResponse = (value) => {
	return `<AuthenticateResponse xmlns="http://tempuri.org/"><AuthenticateResult>${value}</AuthenticateResult></AuthenticateResponse>`;
};

let server;

test("[BEFORE] Start Koa server", assert => {
	server = app.listen(TESTING_PORT);
	assert.end();
});

test("index - Credentials OK", assert => {
	assert.plan(1);
	mockResponse.body = buildResponse(true);

	credentials.authenticate("username", "password").then(res => {
		assert.pass("Got some response");
	}).catch(err => assert.fail(err));
});

test("index - Inexistent username", assert => {
	assert.plan(1);
	mockResponse.body = buildResponse(false);

	credentials.authenticate("username", "password").then(res => {
		assert.fail("Should not get a response");
	}).catch(err => assert.equal(err.message, "Wrong username or password"));
});

test("index - Wrong password", assert => {
	assert.plan(1);
	mockResponse.body = buildResponse(false);

	credentials.authenticate("username", "password").then(res => {
		assert.fail("Should not get a response");
	}).catch(err => assert.equal(err.message, "Wrong username or password"));
});

test("[AFTER] Close Koa server", assert => {
	server.close();
	assert.end();
});
