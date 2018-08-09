var fetch = require("isomorphic-fetch");
var fs = require('fs'); 
var https = require('https'); 

var WSCredentials = function (baseURL, port, certificatePath) {

  var baseURLHasSSL = baseURL.match(/^https:\/\//);
  var groupsPath = function groupsPath(username) {
    return "/entry/" + username + "/json";
  }

  var authPath = function authPath(username, password) {
    return "/json/" + username + "/" + password;
  }

  var sslOptions = function sslOptions(path) { 
    var returnOptions = {
      hostname: baseURL.replace("https://", ""),
      port: port || 443,
      path: path,
      method: 'GET'
    };

    return Object.assign({}, returnOptions, (certificatePath ? { ca: fs.readFileSync(certificatePath) } : { rejectUnauthorized: false }));
  };

  var httpsRequest = function httpsRequest(options, endCallbackFn, errorCallbackFn) {
    var resChunk = '';

    var req = https.request(options, function(res) {
      res.on('data', function(chunk) {
        resChunk += chunk;
      });

      res.on('end', function() {
        endCallbackFn(res, resChunk);
      });
    });

    req.on('error', function(err) {
      errorCallbackFn(err);
    });

    req.end();
  };

  var details = function (username) {
    return new Promise(function (resolve, reject) {
      var url = baseURL + groupsPath(username);

      fetch(url).then(function (res) {
        if (res.status === 200) return res.json();
        else reject({ status: res.status, message: "Error getting "+ url });
      }).then(function (details) {
        resolve(details);
      }).catch(function (err) {
        reject(err);
      });
    });
  };

  var authenticate = function (username, password) {
    return baseURLHasSSL ? authenticateHttps(username, password) : authenticateHttp(username, password);
  };

  var authenticateHttp = function (username, password) {
    return new Promise(function (resolve, reject) {
      var url = baseURL + authPath(username, password);

      fetch(url).then(function (res) {
        if (res.status === 200) {
          if (res.body.read().toString() === "true") return details(username);
          else reject({ code: 401, message: "Wrong username or password" });
        } else {
          reject({ status: res.status, message: "Error getting " + url.replace(password, "***") });
        }
      }).then(function (details) {
        const groups = JSON.parse(JSON.stringify(details.MemberOf)); // hack to clone object
        details.groups = groups;
        resolve(details);
      }).catch(function (err) {
        reject(err);
      });
    });
  };

  var authenticateHttps = function (username, password) {
    return new Promise(function (resolve, reject) {
      var options = sslOptions(authPath(username, password));

      httpsRequest(options, function (res, resChunk) {
        if (res.statusCode === 200) {
          if (resChunk === "true") {
            resolve();
          } else {
            reject({ code: 401, message: "Wrong username or password" });
          }
        } else {
          reject({ status: res.statusCode, message: "Error getting " + options.hostname + options.path.replace(password, "***") });
        }
      }, reject);
    }).then(function() {
      return new Promise(function(resolve, reject) {
        var options = sslOptions(groupsPath(username));

        httpsRequest(options, function(res, resChunk) {
          console.log(resChunk);
          if (res.statusCode === 200) {
            resolve(JSON.parse(resChunk));
          } else {
            reject({ status: res.statusCode, message: "Error getting " + options.hostname + options.path.replace(password, "***") });
          }
        }, reject);
      }).catch(function(err) {
        console.log(err);
      });
    });
  };

  var groups = function (username) {
    return baseURLHasSSL ? groupsHttps(username) : groupsHttp(username);
  };

  var groupsHttp = function (username) {
    return new Promise(function (resolve, reject) {
      var url = baseURL + groupsPath(username);

      fetch(url).then(function (res) {
        if (res.status === 200) return res.json();
        else reject({ status: res.status, message: "Error getting " + url.replace(password, "***") });
      }).then(function (details) {
        resolve(details.MemberOf);
      }).catch(function (err) {
        reject(err);
      });
    });
  };

  var groupsHttps = function (username) {
    return new Promise(function (resolve, reject) {
      var options = sslOptions(groupsPath(username));

      httpsRequest(options, function(res, resChunk) {
        if (res.statusCode === 200) {
          resolve(JSON.parse(resChunk).MemberOf);
        } else {
          reject({ status: res.statusCode, message: "Error getting " + options.hostname + options.path });
        }
      }, reject);
    });
  };

  return {
    details: details,
    authenticate: authenticate,
    groups: groups
  };
};

module.exports = WSCredentials;
