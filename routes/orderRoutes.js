const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");
const {
  createOrder,
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  updateOrders,
} = require("../controllers/orderController");

router
  .route("/")
  .post(authenticateUser, createOrder) //each user can access their own route
  .get([authenticateUser, authorizePermissions("admin")], getAllOrders); //only accessable to admin

router.route("/showAllMyOrders").get(authenticateUser, getCurrentUserOrders);

//Note: the route with id must be the last one otherwise we receive an error
router
  .route("/:id")
  .get(authenticateUser, getSingleOrder)
  .patch(authenticateUser, updateOrders);

module.exports = router;
