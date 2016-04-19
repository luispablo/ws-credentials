"use strict";

const parseString = require("xml2js").parseString;
const Mock = require("./lib/Mock");

module.exports = function (baseURL) {
	return {
		Mock: Mock,
		authenticate: function (username, password) {
			return new Promise(function (resolve, reject) {
				fetch(`${baseURL}/xml/${username}/${password}`).then(res => {
					parseString(res.body.read().toString(), (err, result) => {
						if (err) {
							reject(err);
						} else if (result.AuthenticateResponse.AuthenticateResult == "true") {
							resolve(result);
						} else {
							reject({code: 401, message: "Wrong username or password"});
						}
					});
				}).catch(error => reject(error));
			});
		}
	};
};
