var WSCredentials = require("./lib/WSCredentials");
var Mock = require("./lib/Mock");

var index = WSCredentials;
index.Mock = Mock;

module.exports = index;
