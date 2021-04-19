// Here Is All The Routes About Shop Products //
const express = require('express')
const router = express.Router();
const {getCategories,getCategory,create,update,remove} = require('../../controllers/shop/Categories')
// middlewares
const { requireSignin, isAdmin} = require('../../controllers/user')

// routes
router.post("/setCategory", requireSignin, isAdmin, create);
router.get('/getCategories',getCategories); //router that call function to get all categories
router.get('/getCategory/:catID',getCategory); //router that call function to get all categories
router.put("/updateCategory", requireSignin, isAdmin, update);
router.post("/removeCategory", requireSignin, isAdmin, remove); 

module.exports = router;









