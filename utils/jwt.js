//move the jwt from controllers>authController.js
const jwt = require('jsonwebtoken'); 

//1. create jwt
//create a function to bring the tokenUser and token variables here
const createJWT = ({payload}) =>{  //payload is tokenUser in authController.js
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
}

//2. validate jwt
// jwt.verify():Add the jwt.verfy() in the jwt.js file too before this project it was on middlewares>authentication.js.
const isTokenValid = ({token}) => jwt.verify(token, process.env.JWT_SECRET);

//3. add cookie
//refactor cookies setup:
const attachCookiesToResponse = ({res, user})=>{
  const token = createJWT({payload:user})  //we pass the user as a payload
    const oneDay = 1000 * 60 * 60 * 24; //one day in ms
    res.cookie("token", token, {//res.cookies(cookiesname, value (which is token), options)
      httpOnly: true,
      expires: new Date(Date.now() + oneDay), //find today and add one day to it
      secure: process.env.NODE_ENV === "production",
      signed: true,
    });
    // res.status(201).json({ user });  //if we keep this in the authControllers in register route we still have the right answer
}

module.exports = {
    createJWT,
    isTokenValid,
    attachCookiesToResponse
}