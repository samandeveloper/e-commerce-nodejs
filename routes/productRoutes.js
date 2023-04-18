const express = require('express')
const router = express.Router()

const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

const {
  createProduct, //just admin
  getAllProducts, //open to public
  getSingleProduct, //open to public
  updateProduct, //just admin
  deleteProduct, //just admin
  uploadImage, //just admin
} = require("../controllers/productController");

//alternative way for mongoose virtual
 const {getSingleProductReviews} = require('../controllers/reviewController')

//another way for the below line is: router.route("/").post(authenticateUser, authorizePermissions('admin'), createProduct).get(getAllProducts);
router.route("/")
.post([authenticateUser, authorizePermissions('admin')], createProduct)
.get(getAllProducts);

router.route("/uploadImage")
.post([authenticateUser, authorizePermissions('admin')],uploadImage);

//the route with id must be the last one otherwise we receive error
router.route("/:id")
.get(getSingleProduct)
.patch([authenticateUser, authorizePermissions('admin')],updateProduct)
.delete([authenticateUser, authorizePermissions('admin')],deleteProduct);

router.route('/:id/reviews').get(getSingleProductReviews);

module.exports = router
