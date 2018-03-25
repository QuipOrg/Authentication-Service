let mongoose = require('mongoose');
let bcrypt   = require('bcrypt-nodejs');

let userSchema = mongoose.Schema({
  local: {
    email: String,
    password: String,
    token: String
  },
  facebook: {
    id: String,
    token: String,
    name: String,
    email: String
  },
  twitter: {
    id: String,
    token: String,
    displayName: String,
    username: String
  },
  google: {
    id: String,
    token: String,
    email: String,
    name: String
  }
});

userSchema.methods.generateHash = (password) => {
  return bcrypt.hashSync(password, this.local.password);
};

userSchema.methods.compareHash = (password) => {
  return bcrypt.compareSync(password, this.local.password);
}

module.exports = mongoose.model('User', userSchema);