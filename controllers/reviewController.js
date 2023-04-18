const Review = require("../models/Review");
const Product = require("../models/Product"); //we should bring the Product model too,since users write reviews on the Products
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils");

//Open to all the users (all the users can create review)
const createReview = async (req, res) => {
  const { product: productId } = req.body; 
  const isValidProduct = await Product.findOne({ id: productId }); //find if the product with the specific id exist
  if (!isValidProduct) {
    throw new CustomError.NotFoundError(`No product with id: ${productId}`);
  }
  //check if the user already submitted a review for this specific product
  const alreadySubmitted = await Review.findOne({
    product: productId, //find the specific product using productId
    user: req.user.userId, // find the specific user using the userId
  });
  if (alreadySubmitted) {
    //check whether the specific user already submitted the review for the specific product
    throw new CustomError.BadRequestError(
      "Already Submitted review for this product"
    );
  }
  req.body.user = req.user.userId; //because we have middleware we can write this line
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
};

//open to public
const getAllReviews = async (req, res) => {
  //with populate method we bring more properties from user and product
  const reviews = await Review.find({})
    .populate({
      //since we have the product in the Review model
      path: "product", //path to the product property in models>Review.js
      select: "name company price", //these are 3 items we want to add to our result
    })
    .populate({ //since we have the user in the Review model
      path: "user",
      select: "name",
    });
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

//open to public
const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params; 
  const review = await Review.findOne({ _id: reviewId });
  if (!review) { //if no review exists throw error
    throw new CustomError.NotFoundError(`No review with id ${reviewId}`);
  }
  res.status(StatusCodes.OK).json({ review });
};

//open to all users
const updateReview = async (req, res) => {
  const reviewId = req.params.id;
  console.log(reviewId);
  const { rating, title, comment } = req.body;
  const review = await Review.findOne({ _id: reviewId }); //instead of _id write reviewId
  console.log(review);
  if (!review) {
    throw new CustomError.NotFoundError(`No review with id: ${reviewId}`); //404 error
  }
  //use checkPermission so only the admin and the user who wrote the review can update it
  checkPermissions(req.user, review.user);
  review.rating = rating;
  review.title = title;
  review.comment = comment;
  await review.save();
  res.status(StatusCodes.OK).json({ review });
};

//open to all users
const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId }); //first find the review using review id
  if (!review) {
    throw new CustomError.NotFoundError(`No product with id: ${reviewId}`); //404 error
  }
  //we use checkPermission to make sure that the useId is matches to the review user bacause each user can only delete their own review (not the other users)
  checkPermissions(req.user, review.user);
  await review.remove(); //remove the review
  res.status(StatusCodes.OK).json({ msg: "Success! Review removed." });
};

//below is an alternative way instead of mongoose virtual
const getSingleProductReviews = async(req,res) =>{
  //first we find the product id since we want to find only the reviews associated with the specific product id
  const {id: productId} = req.params
  //get me only the reviews where product matches that specific product
  const reviews = await Review.find({product:productId})
  res.status(StatusCodes.OK).json({reviews, count:reviews.length})
}

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews
};
