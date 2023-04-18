const mongoose = require("mongoose");

//write a seperate schema for cardItems to make it easier
//we are getting these data (image,name, price,...) from the database
const SingleOrderItemSchema = mongoose.Schema({
  name: { type: String, required: true },  //in item in the frontend
  image: { type: String, required: true },  //in item in the frontend
  price: { type: Number, required: true },
  amount: { type: Number, required: true },  //same as quantity
  product: {
    //we should add the product here so we know this name,image, price, amount so we understand these features belongs to which product
    type: mongoose.Schema.ObjectId,
    ref: "Product",
    required: true,
  },
});

const OrderSchema = mongoose.Schema(
  {
    tax: {
      type: Number,
      required: true,
    },
    shippingFee: {
      type: Number,
      required: true,
    },
    subtotal: {
      type: Number,
    },
    total: {
      type: Number,
      required: true,
    },
    orderItems: [SingleOrderItemSchema], 
    status: {
      type: String,
      enum: ["pending", "failed", "paid", "delivered", "canceled"],
      default: "pending",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User", 
      require: true,
    },
    clientSecret: {  //for stripe
      type: String,
      require: true,
    },
    paymentIntentId: {  //for stripe
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
