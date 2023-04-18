require("dotenv").config();
require("express-async-errors"); //instead of try and catch in async functions use this package

const express = require("express");
const app = express();
const connectDB = require("./db/connect");

//routers
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const orderRouter = require("./routes/orderRoutes");

//rest of the packages
const morgan = require("morgan");
const cookieParser = require("cookie-parser"); //to access cookie on the server
const fileUpload = require("express-fileupload");

//security packages:
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");

//Note: 404 must come before errorhandler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

//invoke the security packages:
app.set("proxy", 1); //for the times the cloud set a proxy
app.use(
  rateLimiter({
    windowMS: 15 * 60 * 1000, //windows in ms is set to 15 minutes
    max: 60, //maximun request is 60
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

//middlewares-before routes
app.use(morgan("tiny")); //tiny is one of the options in morgan-tiny gives us a little info about the logs
app.use(express.json()); //we need to access the json data in our req.body
//we signed our cookie with process.env.JWT_SECRET so the token is in the signed cookie
app.use(cookieParser(process.env.JWT_SECRET)); //if we use the signed item as an option in res.cookie() we need to pass the JWT_SECRET to it
app.use(express.static("./public"));
app.use(fileUpload());

//homepage
app.get("/", (req, res) => {
  res.send("ecommerce api");
});

//to test cookie-parser package
app.get("/api/v1", (req, res) => {
  res.send("test cookie");
});

//routes
app.use("/api/v1/auth", authRouter); //assign the route to the authRouter
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI); //return a promise
    app.listen(port, console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};
start();
