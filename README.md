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
