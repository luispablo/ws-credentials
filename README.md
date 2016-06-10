# ws-credentials
Inner WS credentials service consumer

**IMPORTANT: This version (2.0.0) is a complete refactor. Beware of migration changes if you come from version 1.x**

# Install

```bash
npm install --save ws-credentials
```

# User details

To get the details of a user:

```javascript
var credentials = require("ws-credentials")("http://yourserver.com/auth");

credentials.details("tsmith").then(function (userDetails) {
	// userDetails is an object, as such:
	// {
	// 	CN: "Tom Smith",
	// 	Description: null,
	// 	DisplayName: "Tom Wilson Smith",
	// 	GivenName: "Tom",
	// 	GroupType: null,
	// 	HomeDirectory: "\\SVRSOME\HOME\tsmith",
	// 	Mail: "tsmith@svrhome.com",
	// 	MailNickname: "tsmith",
	// 	MemberOf: ["PaperCut", "OtherGroup"],
	// 	Name: "Tom Wilson Smith",
	// 	SAMAccountName: "tsmith",
	// 	Surname: "Smith",
	// 	WhenChanged: "6/5/2016 12:00:26 PM",
	// 	WhenCreated: "8/31/2010 5:54:10 PM"
	// }
}).catch(function (err) {
	console.log("Error getting groups", err);
});
```

In this example, the username is **tsmith**, and it returns a promise, and if the promise resolves, it gives you an object with the details shown above.

# Authentication

Import it and configure to use against your WS URL:

```javascript
var credentials = require("ws-credentials")("http://yourserver.com/auth"); // The server base URL

credentials.authenticate("tsmith", "password").then(function (userDetails) {
	// If you're here you're OK.
	// userDetails is an object, as such:
	// {
	// 	CN: "Tom Smith",
	// 	Description: null,
	// 	DisplayName: "Tom Wilson Smith",
	// 	GivenName: "Tom",
	// 	GroupType: null,
	// 	HomeDirectory: "\\SVRSOME\HOME\tsmith",
	// 	Mail: "tsmith@svrhome.com",
	// 	MailNickname: "tsmith",
	// 	MemberOf: ["PaperCut", "OtherGroup"],
	// 	Name: "Tom Wilson Smith",
	// 	SAMAccountName: "tsmith",
	// 	Surname: "Smith",
	// 	WhenChanged: "6/5/2016 12:00:26 PM",
	// 	WhenCreated: "8/31/2010 5:54:10 PM"
	// }
}).catch(function (err) {
	// If you're here something went wrong, see what:
	console.log(err.message);
});
```

If the user is authenticated, it works as the function to get the user details.

# User groups

You can get the users groups like this:

```javascript
var credentials = require("ws-credentials")("http://yourserver.com/auth");

credentials.groups("username").then(function (groups) {
	// groups is an array like: ["ADGroup1", "AnotherADGroup"]
}).catch(function (err) {
	console.log("Error getting groups", err);
});
```

# Mocking

You also have a mock for when you're developing:

```javascript
var user1 = {
	username: "tsmith",
	password: "fakepass",
	groups: ["group1", "group2"],
	details: { ... }
};

var mock = credentials.Mock([user1, user2, ...]);
```

This function expects an array of users. Each user has the fields **username** and **password** to emulate the authentication; **groups** to use in the groups function, and **details** to mock the details function result.
