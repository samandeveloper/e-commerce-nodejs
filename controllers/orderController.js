const Order = require('../models/Order')
const Product = require('../models/Product')
const{StatusCodes} = require('http-status-codes')
const CustomError = require('../errors')
const {checkPermissions} = require('../utils')

//create fakeStripeAPI function for connecting to stripe
const fakeStripeAPI = async({amount,currency})=>{
  const client_secret = 'someRandomValue'
  return {client_secret,amount}
}

const createOrder = async(req,res)=>{
  //in the cartItem we have image, quantity, price,etc.
  const { items: cartItems, tax, shippingFee } = req.body; //cartItems is an alias of the items //look at mockData>order.json
  if (!cartItems || cartItems.length < 1) {   //firt check if there are any items in my cart (empty or 0)
    throw new CustomError.BadRequestError("No cart items provided"); //400
  }
  //then make sure that tax and shipping fee is passed too- we don't want to sell sth without shipping fee or tax
  if (!tax || !shippingFee) {
    throw new CustomError.BadRequestError(
      "Please provide tax and shipping fee" //error 400
    );
  }
  //check if the product exists using product id --use forEach or map on the product array
  let orderItems = []; //new array- this will eventually the cartItem
  let subtotal = 0; //subtotal = proce*quantity , bydefault it's 0
  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product }); //check if the product id exist in each item in mockData>orders.json, _id is the product id
    if (!dbProduct) { //if product doesn't exist
      throw new CustomError.NotFoundError(
        `No product with id: ${item.product}` //404
      );
    }
    //if the product exist then we want to pull out name, price,image, _id (product id)
    const { name, price, image, _id } = dbProduct;
    const singleOrderItem = {
      //create an object (of items) so we can then add it in the orderItem
      amount: item.amount, //since amount is still in the item
      name,
      price,
      image,
      product: _id,
    };
    //now we want to add item to the orederItem array
    orderItems = [...orderItems, singleOrderItem];

    //do three things to cummunicate to the stripe:
    //Check the product exists in DB and the prices are correct (calculate the total, subtotal)
    subtotal += item.amount * price;
  }
    //calculate total
    const total = tax + shippingFee + subtotal;
    //communicate with stripe and get client secret- client secret is the paymentIntent and the name in client_secret in the fakeStripeAPI
    const paymentIntent = await fakeStripeAPI({ //we created the fakeStripeAPI function on top
      amount: total,
      currency: "usd",
    });

    //create an order
    const order = await Order.create({  //we create the order to see it in the response
      orderItems,
      total,
      subtotal,
      tax,
      shippingFee,
      client_secret: paymentIntent.client_secret,
      user: req.user.userId,
    });
  
  res.status(StatusCodes.CREATED).json({order, clientSecret:order.clientSecret})
}


const getAllOrders = async(req,res)=>{
    const orders = await Order.find({})
    res.status(StatusCodes.OK).json({orders,count: orders.length})
}


const getSingleOrder = async(req,res)=>{
  const { id: orderId } = req.params; 
  console.log(orderId);
  const order = await Order.findOne({ _id: orderId });
  if (!order) { //check if the order exists
    throw new CustomError.NotFoundError(`No order with id : ${orderId}`);
  }
  checkPermissions(req.user, order.user);
  res.status(StatusCodes.OK).json({ order });
}


const getCurrentUserOrders = async(req,res)=>{
    const orders = await Order.find({user:req.user.userId})
    res.status(StatusCodes.OK).json({orders, count: orders.length})
}


//updateOrders similar to getSingleOrder route
const updateOrders = async(req,res)=>{
    const { id: orderId } = req.params; 
    const {paymentIntentId} = req.body
    const order = await Order.findOne({ _id: orderId });
    if (!order) { //check if the order exists
      throw new CustomError.NotFoundError(`No order with id : ${orderId}`);
    }
    checkPermissions(req.user, order.user);
    order.paymentIntentId = paymentIntentId
    order.status = 'paid'
    await order.save()

    res.status(StatusCodes.OK).json({ order });
}

module.exports = {
  createOrder,
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  updateOrders,
};
