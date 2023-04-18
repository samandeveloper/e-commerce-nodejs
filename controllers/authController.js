//we have 3 auth routes in this project: login, logout, register user
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes"); //StatusCodes is camel case
const CustomError = require("../errors");
const { attachCookiesToResponse, createTokenUser } = require("../utils");

//register route- in register form we have name, email, password
const register = async (req, res) => {
  const { email, name, password } = req.body;
  //each user can register with one email so we can not register a person with duplicate email address
  const emailAlreadyExists = await User.findOne({ email }); //find the email
  if (emailAlreadyExists) { //if one email register twice, throw error
    throw new CustomError.BadRequestError("Email already exists");
  }
  //define a role as admin or normal user-condition is only the first person registered is admin
  const isFirstAccount = (await User.countDocuments({})) === 0; //means the firt person register in website
  const role = isFirstAccount ? "admin" : "user";
  const user = await User.create({ name, email, password, role }); 
  //handle jwt
  const tokenUser = createTokenUser(user)
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.CREATED).json({ user: tokenUser }); 
};

//Login route-in the login form we have email and password- in the answer we have name, userId,role
const login = async (req, res) => {
  const { email, password } = req.body; //email and password are available in req.body
  if (!email || !password) {
    //check if email or password doesn't exists
    throw new CustomError.BadRequestError("Please provide email and password"); //error 400
  }
  const user = await User.findOne({ email });
  if (!user) { // since we are loging in check if user doesn't exists- user already registered or not
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) { //check if the password doesn't match
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

//logout route- we don't check anything here we just remove the token
const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.OK).json({ msg: "user logged out!" }); //this line is for test and postman since in logout we don't need to send back anything
};

module.exports = {
  login,
  logout,
  register,
};
