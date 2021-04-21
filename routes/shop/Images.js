// Here Is All The Routes About Shop Products //
const express = require('express')
const router = express.Router();
const {getImages,uploadimages,removeimages} = require('../../controllers/shop/Images');
const { requireSignin, isAdmin } = require('../../controllers/user');

router.get('/getImages',getImages);//router that call function to get all images
router.post('/uploadimages',requireSignin,isAdmin,uploadimages);
router.post('/uploadprofile',uploadimages);
router.post('/removeimages',requireSignin,isAdmin,removeimages);
router.post('/removeprofile',removeimages);
module.exports = router; 