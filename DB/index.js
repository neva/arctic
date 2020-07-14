const mongoose = require("mongoose");

const ip = "localhost";
const port = 30000;
const database = "arctic";

const username = process.env.name;
const password = process.env.pass;

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

module.exports = { User, App }