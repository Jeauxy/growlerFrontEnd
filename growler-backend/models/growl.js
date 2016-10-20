const mongoose = require('mongoose');

const growlSchema = {
  text: String,
}

const Growl = mongoose.model('Growl', growlSchema);

module.exports = Growl;
