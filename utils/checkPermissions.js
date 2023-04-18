const CustomError = require('../errors')

//instead of requestUser and resourceUserId we can say anything like item1 and item2
const checkPermissions = (requestUser, resourceUserId) => {
  // console.log(requestUser);       //{name: 'tom', userId: '6421d26a34a76f5ea56b1ce8', role: 'user',iat: 1680213750,exp: 1680300150}
  // console.log(resourceUserId);     //new ObjectId("6421d26a34a76f5ea56b1ce8")
  // console.log(typeof resourceUserId);   //object
  if (requestUser.role === "admin") return; //if the role:admin we don't have any issue (admin can do anything)
  //e.g.g for the below line is the normal user who can see his profile using his id
  if (requestUser.userId === resourceUserId.toString()) return; //Then we want to check if the request user id is the same as the resource user id then return (we don't have any issue)
  //else
  throw new CustomError.UnauthorizedError(
    "Not authorized to access this route"
  );
};


module.exports = checkPermissions;