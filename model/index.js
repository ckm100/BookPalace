var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    UserSchema;

UserSchema = new Schema({
    uname: String,
    uemail: String,
    upassword: String,
    city: String,
    state: String,
    bookId: [],
    bookData: [{
        title: String,
        authors: [],
        publisher: String,
        publishedDate: String,
        thumbnail: String,
        link: String,
        id: String
    }],
    requestTo: [],
    requestFrom: [],
    requestApprove: []
});


module.exports = mongoose.model("User", UserSchema);
