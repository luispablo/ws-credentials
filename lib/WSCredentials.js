var fetch = require("isomorphic-fetch");

var WSCredentials = function (baseURL) {

  var details = function (username) {
    return new Promise(function (resolve, reject) {
      var url = baseURL +"/entry/"+ username +"/json";

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
    return new Promise(function (resolve, reject) {
      var url = baseURL +"/json/"+ username +"/"+ password;

      fetch(url).then(function (res) {
        if (res.status === 200) {
          if (res.body.read().toString() === "true") return details(username);
          else reject({ code: 401, message: "Wrong username or password" });
        } else {
          reject({ status: res.status, message: "Error getting "+ url });
        }
      }).then(function (details) {
        resolve(details);
      }).catch(function (err) {
        reject(err);
      });
    });
  };

  var groups = function (username) {
    return new Promise(function (resolve, reject) {
      var url = baseURL +"/entry/"+ username +"/json";

      fetch(url).then(function (res) {
        if (res.status === 200) return res.json();
        else reject({ status: res.status, message: "Error getting "+ url });
      }).then(function (details) {
        resolve(details.MemberOf);
      }).catch(function (err) {
        reject(err);
      });
    });
  };

  return {
    details: details,
    authenticate: authenticate,
    groups: groups
  };
};

module.exports = WSCredentials;
