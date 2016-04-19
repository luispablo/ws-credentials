"use strict";

module.exports = function (credentials) {
	return {
		authenticate: function (username, password) {
			return new Promise(function (resolve, reject) {
				if (credentials[username] && credentials[username] === password) {
					resolve();
				} else {
					reject({code: 401, message: "Wrong username or password"});
				}
			});
		}
	};
};
