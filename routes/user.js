const express = require('express')
const router = express.Router()

const {userSigninValidator,userSignupValidator} = require('../validator')

const {signup, signin,signout,requireSignin,userById,
    updateAddress ,getoldProfileImg,auth,updateProfile,getAddress,frogetPassword,updatePassword} = require('../controllers/user')


router.post('/signup',userSignupValidator,signup)
router.post('/signin',userSigninValidator,signin)
router.get('/signout',signout)
router.post('/forgetpassword',frogetPassword)
router.post('/updatePassword',requireSignin,updatePassword)
router.get('/auth',requireSignin,auth)
router.put('/updateProfile',requireSignin,getoldProfileImg,updateProfile)
router.get('/getAddress',requireSignin,getAddress)
router.post('/updateAddress',requireSignin,updateAddress)

router.param("userId", userById)

module.exports = router;
