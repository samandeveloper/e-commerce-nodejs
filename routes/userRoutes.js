const express = require('express');
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");  //add the middleware infront of the route
const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} = require("../controllers/userController");

//Note: in the below route first we MUST check the authenticationUSer then authorizePermissions to check the admin (can't do it vise versa)
//in the below line we can add anything we want like authorizePermissions('admin', 'owner')
router.route("/").get(authenticateUser, authorizePermissions('admin'), getAllUsers);
router.route('/showMe').get(authenticateUser, showCurrentUser)   //Note: /showMe route must be above the /:id otherwise we receive error since it first check if there is other routes if not it will understand it's an id (it will suppose that showMe is id which is not)
router.route("/updateUser").patch(authenticateUser, updateUser);
router.route("/updateUserPassword").patch(authenticateUser, updateUserPassword);
///:id MUST be the last route
router.route("/:id").get(authenticateUser , getSingleUser);

module.exports = router