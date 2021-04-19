// Here Is All The Routes About Shop Products //
const express = require('express')
const router = express.Router();
const {getProducts,
   create,remove,update,
    getProduct,
    getProductImages,
    getTopProducts,
    getSearchProducts,
    productStar,
    getProductStar,
    setWishlishProduct,
    getProductWishlist ,
    getListWishlist,
    deleteListWishlist
} = require('../../controllers/shop/Products')
const {requireSignin,isAdmin} = require ('../../controllers/user')

router.post("/setProduct", requireSignin, isAdmin, create);
router.post("/removeProduct", requireSignin, isAdmin, remove);
router.put("/updateProduct", requireSignin, isAdmin, update);
router.get('/getProducts/',getProducts);
router.get('/getProducts/:catID',getProducts);
router.get('/getProduct/:ID',getProduct);
router.get('/getProductImages/:ID',getProductImages);
router.get('/getTopProducts',getTopProducts);
router.post('/getSearchProducts',getSearchProducts);
router.put("/product/star/:productId", requireSignin, productStar);
router.get("/product/star/:productId",getProductStar)
router.put("/product/wishlist/:productId", requireSignin, setWishlishProduct);
router.post("/product/wishlist/:productId",requireSignin,getProductWishlist )
router.get("/product/wishlist/listwishlist",requireSignin,getListWishlist)
router.post("/product/deletewishlist",requireSignin,deleteListWishlist)

module.exports = router;