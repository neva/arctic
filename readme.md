# Arctic

## What is Arctic?
Arctic is a new authentification service that allows for an easy-to-use and secure authentification System.

## Notices
If you catch any errors feel free to write a mail `paul.hanneforth.o@gmail.com` or create an issue on GitHub.

## Setting up authentification
`Arctic` can be easily dropped into any express app. It only takes a few minutes to implement.
First you need to install `arctic-node`.
```sh
npm install arctic-node
```
Then you can import it.
```js
const arcticNode = require("arctic-node");
```
After that you need to add it to your Express App and replace `YOUR_APP_TOKEN` with your App Token.
```js
yourApp.use("/", arcticNode("YOUR_APP_TOKEN"))
```
Now you have access to all Arctic Functions.
To authenticate a user simply call `res.authenticate("YOUR_APP_ID", "CALLBACK_URL")`, where `YOUR_APP_ID` needs to be replaced with your App ID and the `CALLBACK_URL` needs to be replaced with the URL you want the user to be redirect to when he's authenticated.
To check if a user is authenticated, check the `req.authenticated` variable.
Once he's authenticated you can access the User Informationen in the `req.user` variable. 