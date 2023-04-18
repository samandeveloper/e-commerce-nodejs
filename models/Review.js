const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Please provide rating"],
    },
    title: {
      type: String,
      trim: true, //to remove the white spaces
      maxlength: 100,
      required: [true, "Please provide review title"],
    },
    comment: {
      type: String,
      required: [true, "Please provide review text"],
    },
    user: {
      //bring the user from User.js model
      type: mongoose.Types.ObjectId,
      ref: "User", 
      require: true,
    },
    product: {
      //bring the product from Product.js model
      type: mongoose.Types.ObjectId,
      ref: "Product",
      require: true,
    },
  },
  { timestamps: true }
);
ReviewSchema.index({product:1, user:1},{unique:true})  //only one review per product per user allowed

ReviewSchema.statics.calculateAverageRating = async function(productId){
  const result = await this.aggregate([
    {$match:{product:productId}},
    {$group:{
      _id:'$product',  
      averageRating: {$avg:'$rating'},
      numOfReviews:{$sum:1},
    },
  },
  ]);
  //now we want to update the product so we us this.model('Product')
  try{
    await this.model('Product').findOneAndUpdate(
    {_id:productId},  //find the product we want to update using it's id
    {//below line means if in result[0] we have the averageRating otherwise put 0 (if the averageRating is undefined or null insert undefined)
      averageRating: Math.ceil(result[0]?.averageRating ||0),  //if averageRating doesn't exists insert 0
      numOfReviews: result[0]?. numOfReviews || 0,
    }
    )
  }catch(error){
    console.log(error)
  }
}

//for aggregate pipeline
ReviewSchema.post('save', async function(){
  await this.constructor.calculateAverageRating(this.product); 
})
ReviewSchema.post("remove", async function () {
  await this.constructor.calculateAverageRating(this.product);
});

module.exports = mongoose.model("Review", ReviewSchema);
