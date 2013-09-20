var mongoose = require("mongoose");
var databaseURL = (process.env.MONGOLAB_URI || "mongodb://localhost/deviria");
mongoose.connect(databaseURL);
exports.mongoose = mongoose;