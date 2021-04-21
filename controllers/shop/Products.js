const conn= require('../../DB')


exports.create =(req,res)=>{

  const {title,description,price,topSale,category,images,cover,varietsSelected}=req.body 
 
 let sql=`INSERT INTO products
 ( Category , Title, Price, Description, topSale) 
 VALUES (${category},"${title}",${price},"${description}",${topSale})`
 
 conn.query(sql,function (error, results, fields) {
  if (error) throw error;
  const productID=results.insertId
  insertImagesproduct(productID,images,cover,title);
  if(varietsSelected){
    insertVarietsproduct(productID,varietsSelected)
  } 
});  

res.status(200).json({
  msg:`${title} created  `
});
}
const insertVarietsproduct=(productID,varietsSelected)=>{

 try{
    varietsSelected && varietsSelected.forEach(vari=>{
  let sql='';
  if(vari.filename)
  { sql =`INSERT INTO variets_product ( productID, varitsID, ImgID, Price)
    SELECT ${productID},${vari.ID},ID, ${vari.price?vari.price:null} FROM images WHERE images.Filename="${vari.filename}"`;
  }
  else {
    sql=`INSERT INTO variets_product( productID, varitsID, ImgID, Price) 
    VALUES (${productID},${vari.ID},null,${vari.price?vari.price:null})`
  }
 
    conn.query(sql,function (error, results, fields) {
    if (error) throw error && res.status(400).json({
      err:error
    }); 
  
  
  });

 })
}
catch{
  console.log("error")
}
}
const insertImagesproduct=(productID,images,cover,title)=>{
  try{
  images&& images.forEach((image,index) => {
  
     if (image==cover){
       sql=`INSERT INTO images( ProductID, ImgTitle, Filename, Cover) 
             VALUES (${productID},"${title}${index}${Date.now()}","${image}",${true})`
             conn.query(sql,function (error, results, fields) {
               if (error) throw error && res.status(400).json({
                 err:error
               }); 
               imgID=results.insertId
             });
           
     }
     else{
       sql=`INSERT INTO images( ProductID, ImgTitle, Filename, Cover) 
       VALUES (${productID},"${title}${index}${Date.now()}","${image}",${false})`
       conn.query(sql,function (error, results, fields) {
         if (error) throw error && res.status(400).json({
           err:error
         }); 
         
       });
      
     }
     
    
  
   });
  }
  catch{
    console.log("error")
  }
}
exports.update=(req,res)=>{
  
 const {title,description,price,category,images,varietsSelected,topSale,cover}=req.body.values
const productID=req.body.ID
let sql=`UPDATE products SET Category=${category}
,Title="${title}",Price=${price},Description="${description}",topSale=${topSale} WHERE ID=${productID}`
try{
  conn.query(sql,function (error, results, fields) {
  if (error) throw error&& res.status(400).json({
    err:error
  });
});
  sql=`DELETE FROM images WHERE ProductID=${productID}`
  conn.query(sql,function (error, results, fields) {
    if (error) throw error&& res.status(400).json({
      err:error
    });
   
  });
  sql=`DELETE FROM variets_product WHERE productID=${productID}`
    conn.query(sql,function (error, results, fields) {
      if (error) throw error&& res.status(400).json({
        err:error
      });
    
  }); 
  
    insertVarietsproduct(productID,varietsSelected)
  
 insertImagesproduct(productID,images,cover,title)
 res.status(200).json({
  msg:`${title} updated  `
});
}
catch{
  console.log("error")
}
}
exports.remove =(req,res)=>{
 const {ID}=req.body
let sql=`DELETE FROM products WHERE ID=${ID}`
conn.query(sql,function (error, results, fields) {
  if (error) throw error&& res.status(400).json({
    err:error
  }); 
 
  res.status(200).json({
    msg:`Product deleted `
  });

});  

}
exports.getProducts =(req,res)=>{
  
  let sql = `SELECT products.* , images.Filename,categories.Name AS CategoryName FROM products INNER JOIN categories ON categories.ID = products.Category INNER JOIN images ON images.ProductID=products.ID WHERE images.cover=1  ORDER BY products.Title DESC`
  if(req.params.catID)
     sql = `SELECT products.* , images.Filename,categories.Name AS CategoryName 
     FROM products INNER JOIN categories ON categories.ID = products.Category
      INNER JOIN images ON images.ProductID=products.ID WHERE images.cover=1 AND 
      products.Category=${req.params.catID} ORDER BY products.Title DESC `
 
  
     conn.query(sql,function (error, results, fields) {
      if (error) throw error;
     
      res.send(results);

  });  
}
exports.getProduct =(req,res)=>{
  const {ID} =req.params
  let sql = `SELECT *  FROM products WHERE products.ID=${ID}`

   conn.query(sql,function (error, results, fields) {
    if (error) throw error;
   
    res.send(results);

});  
}
exports.getTopProducts =(req,res)=>{
  
  let sql = `SELECT products.* , images.Filename FROM products INNER JOIN images ON 
  images.ProductID=products.ID WHERE images.cover=1 AND topSale=1`

   conn.query(sql,function (error, results, fields) {
    if (error) throw error;
   
    res.send(results);

});  
}
exports.getProductImages=(req,res)=>{
  const {ID} = req.params
  let sql = `SELECT *  FROM images WHERE ProductID=${ID}`

   conn.query(sql,function (error, results, fields) {
    if (error) throw error;
   
    res.send(results);

});  
}

exports.getSearchProducts =(req,res)=>{
  const {search} =req.body
  
  let sql = `SELECT products.ID, images.Filename,images.cover, products.Title, products.Price FROM products INNER JOIN images ON images.ProductID=products.ID WHERE products.Title  LIKE '%${search}%'`

   conn.query(sql,function (error, results, fields) {
    if (error) throw error;
   
    res.send(results);

});  
}

exports.getRelatedProducts=(req,res)=>{
  
  let {productID,catID}=req.body
  
  
  let sql=`SELECT products.* , 
  images.Filename,categories.Name AS CategoryName FROM products INNER JOIN categories ON categories.ID = products.Category INNER JOIN images ON images.ProductID=products.ID WHERE images.cover=1 
  AND products.Category=${catID} 
  AND NOT products.ID =${productID} LIMIT 3`

  conn.query(sql,function (error, results, fields) {
    if (error) throw error;
   
    res.send(results);

});  

}
exports.productStar =  (req, res) => {
  let productID = req.params.productId;
  let id = req.auth.id;
  const { star } = req.body;
  let sql= `SELECT * from productstar WHERE userID=${id} AND productID=${productID}`
 
  conn.query(sql,function (error, results, fields) {
    if (error) throw error;
    if(results.length==0){
      sql=`INSERT INTO productstar (userID,productID,stars) VALUES (${id},${productID},${star})`
      conn.query(sql,function (error, results, fields) {
      
        res.send(results)
      })
    }
    else{
      sql=`UPDATE productstar SET stars=${star} WHERE userID=${id} AND productID=${productID}`
      conn.query(sql,function (error, results, fields) {
      
        res.send(results)
      })

    }
 })
};
exports.getProductStar =(req, res)=>{
  let productID = req.params.productId;
  let sql= `SELECT * from productstar WHERE productID=${productID}`
  conn.query(sql,function (error, results, fields) {
   
     res.send(results)
   })
}
exports.setWishlishProduct=(req, res) => {
  let productID = req.params.productId;
  let id = req.auth.id;
  
  let sql= `SELECT * from wishlist WHERE userID=${id} AND productID=${productID}`
  conn.query(sql,function (error, results, fields) {
    if (error) throw error;
    if(results.length==0){
      sql=`INSERT INTO  wishlist (userID,productID) VALUES (${id},${productID})`
      conn.query(sql,function (error, results, fields) {
      
       return res.status(200).json({ message: "Product add to Wishlist",status:true})
      })
      
    }
    else{
      sql=`DELETE FROM wishlist  WHERE userID=${id} AND productID=${productID}`
      conn.query(sql,function (error, results, fields) {
       
        return res.status(200).json({ message: "Product remove it from Wishlist",status:false})
      })

    }
  });
}
exports.getProductWishlist =(req, res)=>{
  let productID = req.params.productId;
  let id = req.auth.id;
  let sql= `SELECT * from wishlist WHERE userID=${id} AND productID=${productID}`
  conn.query(sql,function (error, results, fields) {
 
     if(results && results.length==0){
       res.send(false)
     }
     else res.send(results)
   })
}
exports.getListWishlist =(req, res)=>{
  let id = req.auth.id;
  let sql= `SELECT wishlist.* ,products.* , images.Filename FROM products
  INNER JOIN images ON images.ProductID=products.ID 
  INNER JOIN wishlist ON wishlist.productID=products.ID
  WHERE wishlist.userID=${id} AND images.Cover=1`
  conn.query(sql,function (error, results, fields) {
    
     res.send(results)
   })
}
exports.deleteListWishlist =(req, res)=>{
  let id = req.auth.id;
  let {wishID}=req.body
  let sql= `DELETE FROM wishlist  WHERE userID=${id} AND wishID=${wishID}`

  conn.query(sql,function (error, results, fields) {
   
    res.send(results)
   })
}

