const mongoose = require("mongoose");

const ip = "db";
const port = 27017;
const database = "arctic";
console.log("Test", ip, port);

const username = process.env.NAME;
const password = process.env.PASS;

// connect to database
mongoose.connect("mongodb://" + ip + ":" + port + "/" + database, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    auth: { "authSource": "admin" },
    user: username,
    pass: password
});

mongoose.connection.on("error", (error) => {
    console.log("DB | " + error)
})
mongoose.connection.once("open", () => {
    console.log("DB | Started successfully!")
})

const UserSchema = {
    id: String,
    apps: Array,
    email: String,
    password: String,
    token: String,
    name: String
};
const User = mongoose.model("User", UserSchema);

const AppSchema = {
    id: String,
    token: Array,
    member: Array,
    name: String
};
const App = mongoose.model("App", AppSchema);

const LinkSchema = {
    verifyURL: String,
    name: String,
    email: String,
    password: String
}
const Link = mongoose.model("Link", LinkSchema);

module.exports = { User, App, Link }