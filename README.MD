## Hosted Project

[E-Commerce API Heroku URL](https://e-commerce-api-10.herokuapp.com/)

#### Setup Basic Express Server

- [x] import express and assign to variable
- [x] setup start port variable (5000) and start function

#### Connect To DB

- [x] get connection string
- [x] setup .env with MONGO_URL variable and assign the value
- [x] import 'dotenv' and setup package
- [x] import connect() and invoke in the starter
- [x] restart the server
- [x] mongoose V6 info

#### Basic Routes and Middleware

- [x] setup / GET Route
- [x] setup express.json() middleware
- [x] setup 404 and errorHandler middleware (setup two middlewares 404 and errorHandler)
- [x] import 'exress-async-errors' package  (instead of try and catch in routes not for the start function at the end of the app.js)

#### 404 vs ErrorHandler Middleware

#### Morgan Pacakge
when project become bigger then we use morgan package to give us some info about the project like the statuscode and response time of that route
- [Morgan Package](https://www.npmjs.com/package/morgan)

#### User Model

- [x] create models folder and User.js file
- [x] create schema with name,email, password, role (all type:String)
- [x] export mongoose model

#### Validator Package (2 ways for email validator)

- [Validator](https://www.npmjs.com/package/validator)

#### Auth Routes Structure

- [x] create controllers folder
- [x] add authController file
- [x] export (register,login,logout) functions
- [x] res.send('some string value')
- [x] create routes folder
- [x] setup authRoutes file
- [x] import all controllers
- [x] setup three routes
- [x] post('/register') post('/login') get('/logout')
- [x] import authRoutes as authRouter in the app.js
- [x] setup up the middleware app.use('/api/v1/auth', authRouter)

#### Test Routes in Postman

#### Register Controller

- [x] create user (from the model in controllers>authController.js)
- [x] send response with entire user (only while testing) -use postman to check the Auth>register route
- [x] check if email already in use (schema and controller) -Unique email
- [x] ignore 'role'
- [x] alternative 'admin' setup (define the role in register route-just the first person register in website is admin)

#### Handle Password

- [x] UserSchema.pre('save') - hook
- this points to User
- bcrypt.genSalt - number of rounds
- bcrypt.hash
-UserSchema.methods.comparePassword (use bcrypt.compare inside this function)

#### JWT

- [x] require 'jsonwebtoken' package
- [x] create jwt - jwt.sign(payload,secret,options)
- [x] verify jwt - jwt.verify(token,secret) -- instead of setup Bearer in this project we can set cookies
- [x] add variables in .env JWT_SECRET=jwtSecret and JWT_LIFETIME=1d
- [x] restart the server !!!!
- [x] refactor code, create jwt functions in utils
- [] refactor cookie code
- [x] setup func attachCookiesToResponse (in jwt.js file since we want to use the createJWT variable)
- [x] accept payload(res, tokenUser)
- [x] create token, setup cookie
- [x] optionally send back the response or not (we have another way)

#### Login Route

- [x] check if email and password exist, if one missing return 400
- [x] find user, if no user return 401 (with User.findOne({}) check is such a user exists if no return 401)
- [x] check password, if does not match return 401 (we already have the password on the User.js)
- [x] if everything is correct, attach cookie
  and send back the same response as in register

#### Logout Route

- [x] set token cookie equal to some string value
- [x] set expires:new Date(Date.now())

#### User Routes Structure

- [x] add userController file (in the controllers folder)
- [x] export (getAllUsers,getSingleUser,showCurrentUser,updateUser,updateUserPassword) functions -- updateUserPassword is different from user forget password (next project we do this one) 
- [x] res.send('some string value')
- [x] setup userRoutes file (in the routes folder)
- [x] import all controllers
- [x] setup just one route - router.route('/').get(getAllUsers);
- [x] import userRoutes as userRouter in the app.js
- [x] setup app.use('/api/v1/users', userRouter)

#### GetAllUsers and GetSingleUser

- [x] Get all users where role is 'user' and remove password
- [x] Get Single User where id matches id param and remove password
- [x] If no user 404

#### Authenticate User Setup

#### Auth User Complete

#### Authorize Permissions Setup

- [x] hardcode

#### Authorize Permissions Complete

- [x] introduce params

#### ShowCurrentUser

- [x] get user from req (req.user)
- [x] send response with user

#### UpdateUserPassword

- [x] almost identical to login user
- [x] add authenticateUser middleware in the route
- [x] check for oldPassword and newPassword in the body (req.body)
- [x] if one missing 400
- [x] look for user with req.user.userId
- [x] check if oldPassword matches with user.comparePassword
- [x] if no match 401
- [x] if everything good set user.password equal to newPassword
- [x] await user.save() >> to save our instances

#### createTokenUser function in Utils -optional

- [x] create a file in utils (createTokenUser)
- [x] setup a function that accepts user object and returns userToken object
- [x] export as default
- [x] setup all the correct imports/exports and refactor existing code

#### updateUser with User.findOneAndUpdate()-way1

- [x] add authenticateUser middleware in the route
- [x] check for name and email in the body (users are in req.user)
- [x] if one is missing, send 400 (optional)
- [x] use findOneAndUpdate()
- [x] create token user, attachCookiesToResponse and send back the tokenUser- because we change some values we need to create token so frontend know that e.g. change the name of john to susan

#### updateUser with user.save()-way2

#### Setup and Apply checkPermissions()

#### Product Model

- [x] create Product.js in models folder
- [x] create Schema
- [x] name : {type:String}
- [x] price: {type:Number}
- [x] description: {type:String}
- [x] image: {type:String}
- [x] category: {type:String}
- [x] company: {type:String}
- [x] colors: {type:[]}
- [x] featured: {type:Boolean}
- [x] freeShipping: {type:Boolean}
- [x] inventory:{type:Number}
- [x] averageRating:{type:Number}
- [x] user
- [x] set timestamps
- [x] export Product model

#### Product Structure

- [x] add productController file in controllers
- [x] export (createProduct, getAllProducts,
  getSingleProduct, updateProduct, deleteProduct, uploadImage) functions
- [x] res.send('function name') - test it in postman
- [x] setup productRoutes file in routes
- [x] import all controllers
- [x] only getAllProducts and getSingleProduct accessible to public
- [x] rest only by admin (setup middlewares)- setup a new middleware so only admin can access to some of the above routes
- [x] typical setup
- [x] router.route('/uploadImage').post(uploadImage)
- [x] import productRoutes as productRouter in the app.js
- [x] setup app.use('/api/v1/products', productRouter)

#### Product Routes in Postman

#### Create Product

- [x] create user property on req.body and set it equal to userId (req.user)- this is post route so every thing is in req.body if it is not there the admin should provide those values. The only thing we need to do is to attach userId to req.body. how? line below
- [x] pass req.body into Product.create - create user property on the req.body and we set it equal to userId 
- [x] send back the product

#### Remaining Controllers (apart from uploadImage)- create remaining controllers routes except uploadImage

- [x] getAllProducts
- [x] getSingleProduct
- [x] updateProduct
- [x] deleteProduct
- [x] typical CRUD, utilize (in the previous projects look for task manager or job-api) 
- [x] remember we check already for role 'admin'- in this project we just need one "admin"
we are just checking for product id (comes from req.params)

#### Upload Image

- [x] if some question, re-watch 07-file-upload
- [x] images folder with two images

#### Review Model

- [x] create Review.js in models folder
- [x] create Schema
- [x] rating : {type:Number}
- [x] title: {type:String}
- [x] comment: {type:String}
- [x] user  (since we want to attach the user to the review)
- [x] product  (since we want to attach the product to that review)
- [x] set timestamps
- [x] export Review model

#### Review Structure

- [x] add reviewController file in controllers
- [x] export (createReview, getAllReviews, getSingleReview, updateReview, deleteReview) functions
- [x] res.send('function name')
- [x] setup reviewRoutes file in routes
- [x] import all controllers
- [x] only getAllReviews and getSingleReview accessible to public
- [x] rest of the routes only to users (setup middleware)- just admin can access rest of the routes
- [x] typical REST setup
- [x] import reviewRoutes as reviewRouter in the app.js
- [x] setup app.use('/api/v1/reviews', reviewRouter)

#### Create Review

- [x] check for product in the req.body
- [x] attach user property (set it equal to req.user.userId) on to req.body
- [x] create review
- [x] don't test yet in postman

#### Get All Reviews and Get Single Review

- [x] both public routes, typical setup

#### Delete Review

- [x] get id from req.params
- [x] check if review exists
- [x] if no review, 404
- [x] check permissions (req.user, review.user)- check if the userId matches the review.user
- [x] use await review.remove()
- [x] finally, send back 200

#### Update Review

- [x] get id from req.params
- [x] get {rating, title, comment} from req.body -- we can update these three items
- [x] check if review exists
- [x] if no review, 404
- [x] check permissions- just admin and the user who wrote the review can update it
- [x] set review properties equal to rating, title, comment (one by one)
- [x] use await review.save()
- [x] send back 200

#### Populate Method
.populate is a method. 

#### Mongoose Virtuals 

#### Get Single Product Reviews (alternative way for Mongoose Virtuals)

#### Remove All Reviews

#### Aggregation Pipeline - Atlas and Code

#### Order Schema

- [x] create Order.js in models folder
- [x] create Schema
- [x] tax : {type:Number}
- [x] shippingFee: {type:Number}
- [x] subtotal: {type:Number}
- [x] total: {type:Number}
- [x] orderItems:[]  -- we can create a seperate schema and reference the schema in this array
- [x] status:{type:String}  -- status will be an enum
- [x] user  -- rference the user
- [x] clientSecret:{type:String}  --this is the one we send to the frontend
- [x] paymentId:{type:String}  - once completed the frontend sends us back the payementId
- [x] set timestamps
- [x] export Order model

#### Order Structure

- [x] add orderController file in controllers
- [x] export (getAllOrders, getSingleOrder, getCurrentUserOrders,
  createOrder, updateOrder) functions
- [x] res.send('function name')
- [x] setup orderRoutes file in routes
- [x] import all controllers
- [x] authenticate user in all routes
- [x] getAllOrders accessable only to admin- rest of the routes should be available to the user too if she/he has logged in
- [x] typical REST setup
- [x] router.route('/showAllMyOrders').get(getCurrentUserOrders)
- [x] import orderRoutes as orderRouter in the app.js
- [x] setup app.use('/api/v1/orders', orderRouter)

#### Order in Postman

#### Create Order

- [x] most complex

#### Get All Orders and Get Single Order

- [x] getAllOrders - admin only
- [x] getSingleOrder - chechPermissions (check if the order exists by id we also want to check the permissions)

#### Get Current User Orders

- [x] find orders where user is equal to req.user.userId (userId sits in req.user.userId)

#### Update Order

- [x] get order id (from req.params)
- [x] get paymentIntentId (from req.body)
- [x] get order
- [x] if order does not exist - 404
- [x] check permissions (because each user can update their own order)
- [x] set paymentIntentId and status as 'paid'
- [x] order.save()

#### Create Docs

- [x] [Docgen Library] (https://github.com/thedevsaddam/docgen)
- [x] Export Postman Collection
- [x] docgen build -i fileName.json -o index.html
- [x] create index.html in public

#### Security Packages

- [x] express-rate-limiter (to limit the request from each ip address)
- [x] helmet  (to set security http or response headers)
- [x] xss-clean  (to sanatize user input)
- [x] express-mongo-sanitize  (to protect againt mongodb injections)
- [x] cors (cookies!!!!) (to allow access from different domains)

#### Deploy on Heroku

- [x] heroku account and heroku cli
- [x] remove/copy from the main repo (copy the ready project on desktop not to receive errors)
- [x] add dev command "nodemon app.js" 
- [x] change start to "node app.js"
- [x] setup node version in package.json
- [x] "engines": {"node": "14.x"}
- [x] Procfile "web: node app.js"
- [x] remove existing git repo
- [x] rm -rf .git - mac,
- [x] git init
- [x] git add .
- [x] git commit -m "initial commit"
- [x] heroku login
- [x] heroku create "App Name"
- [x] git remote -v
- [x] setup env vars in GUI
- [x] git push heroku master/main
