//we can use this index.js file or directly use the jwt.js and import that one
//import all the function
const { createJWT, isTokenValid, attachCookiesToResponse } = require("./jwt"); //or const jwt = require('./jwt')
const createTokenUser = require('./createTokenUser') 
const checkPermissions = require("./checkPermissions"); 

//export all the functions
module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
  createTokenUser,
  checkPermissions,
};
