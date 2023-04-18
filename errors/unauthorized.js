//403 error for admin access
const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("./custom-api");

class UnauthenticatedError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;  //FORBIDDEN:403 error
  }
}

module.exports = UnauthenticatedError;
