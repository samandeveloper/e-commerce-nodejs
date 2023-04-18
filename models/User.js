const mongoose = require("mongoose");
const validator = require('validator'); //import validator npm package
const bcrypt = require("bcryptjs");


const UserSchema = new mongoose.Schema({
  name: {
    type: String, 
    required: [true, "Please provide name"], 
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, "please provide email"], //means require:true otherwise "please provide email"
    //using Custom Validators in https://mongoosejs.com/docs/validation.html + validate npm package
    validate: {
      //validate object includes validator and message
      validator: validator.isEmail, //validator.isEmail is the function we are looking for
      message: "please provide valid email",
    },
    unique: true   //email must be unique
  },
  password: {
    type: String,
    require: [true, "please provide password"],
    minlength: 6,
  },
  //different role (normal user or admin)
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user", //by default all the users are normal users
  },
});


UserSchema.pre("save", async function () {
  //if we are not modifiing the password then return and don't apply the two below line (don't hash the password)
  if(!this.isModified('password')) return
  //using old function is easier here-since with old function it points to the user but with arrow function it doesn't
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt); //.hash(curent password,salt)
});

//comparing the passwords:
UserSchema.methods.comparePassword = async function (canditatePassword) {
  //candidatePassword is the password user type while registering
  const isMatch = await bcrypt.compare(canditatePassword, this.password); //this.password is the hashed password
  return isMatch;
};

module.exports = mongoose.model('User', UserSchema) 