"use strict";

var Mock = function (users) {

	function getByUsername (username) {
		var foundUsers = users.filter(function (user) { return user.username === username; });
		return (foundUsers !== null && foundUsers.length > 0) ? foundUsers[0] : null;
	}

	function authenticate (username, password) {
		return new Promise(function (resolve, reject) {
			var user = getByUsername(username);
			if (user !== null && user.password === password) resolve(user.details);
			else reject({ code: 401, message: "Wrong username or password" });
		});
	}

	function details (username) {
		return new Promise(function (resolve, reject) {
			var user = getByUsername(username);
			if (user !== null) resolve(user.details);
			else reject({ status: 404, message: "User not found" });
		});
	}

	function groups (username) {
		return new Promise(function (resolve, reject) {
			var user = getByUsername(username);
			if (user !== null) resolve(user.groups);
			else reject({ status: 404, message: "User not found" });
		});
	}

	return { authenticate: authenticate, details: details, groups: groups };
};

module.exports = Mock;
