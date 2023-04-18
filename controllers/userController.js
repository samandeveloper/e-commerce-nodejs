const User = require('../models/User')
const {StatusCodes} = require('http-status-codes');
const CustomError = require('../errors');
const {createTokenUser, attachCookiesToResponse, checkPermissions} = require('../utils')

const getAllUsers = async(req,res) =>{
  //get all the users with role: user and remove the password from their object
  const users = await User.find({ role: "user" }).select('-password');  //.select will remove (exclude) whatever inside of it like password
  res.status(StatusCodes.OK).json({users})
}

const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select('-password'); //remove the password
  if(!user){  //if we pass the wrong id we receive an error
    throw new CustomError.NotFoundError(`No user with id: ${req.params.id}`)  //error 404
  }
  //for prevent accessing each normal user to another user profile using her/his id
  checkPermissions(req.user, user._id)
  res.status(StatusCodes.OK).json({user})
};

//if the user logged in and we have the token then show the user to me in the frontend
//otherwise (token expires) then throw back error and in the frontend because there is no user so we don't have to worry about this function
const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({user:req.user});
};


const updateUser = async (req, res) => {  
  const { name, email } = req.body;
  if (!name || !email) {
    throw new CustomError.BadRequestError("Please provide all values");
  }
  const user = await User.findOne({_id: req.user.userId})  //find the user which want to update using id
  user.email =email;
  user.name = name;
  await user.save();

  //since we still want to see the rest of the items in User.js for each user (like password and role) we need to add the below line
  const tokenUser = createTokenUser(user); 
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

//update password
const updateUserPassword = async (req, res) => {
  const {oldPassword, newPassword} = req.body //means when user wants to change the password they will pass old password and new password in the frontend
  if(!oldPassword || !newPassword){
    throw new CustomError. BadRequestError('Please provide both values')  //400
  }
  //if the user exists means that user exists and we have the token
  const user = await User.findOne({_id: req.user.userId})  //where the id matches the req.user.userId

  //check if the password correct
  const isPasswordCorrect = await user.comparePassword(oldPassword) //models>User.js
  if(!isPasswordCorrect){
    throw new CustomError.UnauthenticatedError('Invalid credentials')  //error 404
  }
  user.password = newPassword  //set the password to the new password 
  await user.save()  // then save that new password

  res.status(StatusCodes.OK).json({msg: 'Success! password updated'}) //we don't need to send anything so just send the success message
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};