// Here Is All The Routes About Shop Products //
const express = require('express')
const router = express.Router();
const {getVariets,create,list,update,remove,removeTitle,updateTitle,getVarietById} = require('../../controllers/shop/Variets')
// middlewares
const { requireSignin, isAdmin} = require('../../controllers/user')

router.post('/getVariets',getVariets);//router that call function to get all the Variets for Product ID 
router.post('/createVariet',requireSignin,isAdmin,create);//router that call function to create  Variets 
router.get('/listVariets',list);
router.put("/updateVariet", requireSignin, isAdmin, update);
router.post("/removeVariet", requireSignin, isAdmin, remove); 
router.post("/removeVarietTitle", requireSignin, isAdmin, removeTitle); 
router.put("/updateVarietTitle", requireSignin, isAdmin, updateTitle);


module.exports = router;