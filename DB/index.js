const mongoose = require("mongoose");

const ip = "localhost";
const port = 30000;
const database = "arctic";

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

const Schema = mongoose.Schema

const UserSchema = new Schema({
    id: String,
    apps: Array,
    email: String,
    password: String,
    token: String,
    name: String
});
const User = mongoose.model("User", UserSchema);

const AppSchema = new Schema({
    id: String,
    token: Array,
    member: Array,
    name: String
});
const App = mongoose.model("App", AppSchema);

const LinkSchema = new Schema({
    verifyURL: String,
    name: String,
    email: String,
    password: String,
    createdAt: { type: Date, default: Date.now },
    expireAt: { type: Date, default: Date.now, index: { expires: '1d' }}
})
const Link = mongoose.model("Link", LinkSchema);

module.exports = { User, App, Link }