const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true, //if there is white space remove it
      required: [true, "Please provide product name"],
      maxlength: [100, "Name can not be more than 100 character"],
    },

    price: {
      type: Number,
      required: [true, "Please provide product price"],
      default: 0, //by default price=0
    },
    description: {
      type: String,
      required: [true, "Please provide product description"],
      maxlength: [1000, "Description can not be more than 1000 characters"],
    },
    image: {
      type: String,
      default: "/uploads/example.jpg", //if we don't upload an image, this will be a route to the default image
    },
    category: {
      type: String,
      required: [true, "Please provide product category"],
      enum: ["office", "kitchen", "bedroom"],
    },
    company: {
      type: String,
      required: [true, "Please provide product company"],
      enum: {
        values: ["ikea", "liddy", "marcos"],
        message: "{VALUE} is not supported", //VALUE is the value that user provided
      },
    },
    colors: {
      type: [String], 
      default:['#222'],
      required: true,
    },
    featured: {
      type: Boolean,
      dafault: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      required: true,
      default: 15,
    },
    averageRating: { //this is for aggregate pipeline
      type: Number,
      default: 0,
    },
    numOfReviews: { //this is for aggregate pipeline
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User", 
      require: true,
    },
  }
);

productSchema.pre('remove', async function(next){ //with the latest version of mongoose we don't need to call the next in pre
  //we have this and model method. in the model method we can pass a different model- when we removing the product we want to access the review model
  //in deleteMany method we say what reviews we want to delete
  await this.model('Review').deleteMany({product:this._id});
  next()  //we can remove the next line in new mongoose version
})

module.exports = mongoose.model("Product", productSchema);
