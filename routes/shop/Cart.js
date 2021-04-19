
const express = require('express')
const router = express.Router();
const {getCart,updateCart,deleteCart, emptyCart} = require('../../controllers/shop/Cart')
const { requireSignin} = require('../../controllers/user')



// routes
router.get("/getCart",requireSignin, getCart);
router.post("/updateCart",requireSignin, updateCart);
router.get("/emptyCart",requireSignin, emptyCart);
/* router.post("/deleteCart",requireSignin,deleteCart); */

module.exports = router;






