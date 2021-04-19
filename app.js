const express = require("express");
const app = express();
const fileUpload = require('express-fileupload');
const expressValidator = require('express-validator');
const morgan = require('morgan')
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser')
const productsRoutes = require('./routes/shop/Products')
const categoriesRoutes = require('./routes/shop/Categories')
const imagesRoutes = require('./routes/shop/Images')
const varietsRoutes = require('./routes/shop/Variets')
const cartRoutes = require('./routes/shop/Cart')
const userRoutes = require('./routes/user')
const checkOutRoutes = require('./routes/shop/Orders')


//app middlewares 


app.use(cors()) ;
app.use(bodyParser.json({ limit: '50mb' }));
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000,
  })
)
app.use(cookieParser())
app.use(morgan("dev"))
app.use(express.static('public'))
app.use(expressValidator())
app.use(fileUpload());
//app Routess

app.use("/api", productsRoutes);
app.use("/api", categoriesRoutes);
app.use("/api", imagesRoutes);
app.use("/api", varietsRoutes);
app.use("/api", cartRoutes);
app.use("/api",userRoutes)
app.use("/api",checkOutRoutes)



app.listen(process.env.PORT || 8000, function () {
    console.log('Localhost port ' +process.env.PORT )
  })