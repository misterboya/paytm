const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://boyamister:s3nSSQfFnCgTtBur@cluster0.bzol0u3.mongodb.net/paytm?retryWrites=true&w=majority&appName=Cluster0");

const userSchema = mongoose.Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String
})

const User = mongoose.model("User", userSchema);

module.exports = {
    User
}