
const express = require('express');
const { getCart } = require('../../controllers/shop/Cart');
const router = express.Router();

const { getCheckOut,createOrder, getUserOrders, getAdminOrders,updateAdminOrderStatus } = require('../../controllers/shop/Orders')
const { requireSignin, isAdmin} = require('../../controllers/user')



// routes
router.get("/getCheckOut/",requireSignin, getCheckOut);
router.post("/user/createUserOrder",requireSignin, createOrder);
router.get('/user/getUserOrder',requireSignin,getUserOrders)
router.get('/admin/getAdminOrder',requireSignin,isAdmin,getAdminOrders)
router.post('/admin/updateOrderStatus',requireSignin,isAdmin,updateAdminOrderStatus)

module.exports = router;






