const CustomError = require('../errors')
const {isTokenValid} = require('../utils')  //this belongs to jwt.verify

const authenticateUser =  async(req,res,next)=>{
    //token is in the signed cookie so we are checking it here:
    const token = req.signedCookies.token  //because in jwt we name the cookie, "token"
    if(!token){  //like when we logout or if the user hasn't registered or logged in
        throw new CustomError.UnauthenticatedError('Authentication Invalid')
    }
    //if the token is present use try and catch
    try{
      const payload = isTokenValid({ token }); 
      req.user = payload; 
      next();
    }catch(error){
        throw new CustomError.UnauthenticatedError("Authentication Invalid");
    }
}

//pass argument to authorizePermissions
const authorizePermissions = (...roles) => {  //...role or ...anyname means get all the arguments in userRoute.js
    return (req,res,next)=> {  //since express need a function with req, res and next here
        if(!roles.includes(req.user.role)){
            throw new CustomError.UnauthorizedError('Unauthorized to access this rote')
        }
        next();
    }
};

module.exports = {
  authenticateUser,
  authorizePermissions,
};