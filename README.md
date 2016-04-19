# ws-credentials
Inner WS credentials service consumer

# Install
npm install --save ws-credentials

# Usage
```
const WSCredentials = require("ws-credentials");
const credentials = WSCredentials("http://yourserver.com/auth"); // The server base URL

...

credentials.authenticate("username", "password").then(res => {
	// If you're here you're OK.
}).catch(err => {
	// If you're here something went wrong, see what:
	console.log(err.message);
});

```

You also have a mock for when you're developing:

```
const users = {
	"username1": "pass1",
	"username2": "pass2"
};
const mock = credentials.Mock(users);
```

and then use it as usual.
