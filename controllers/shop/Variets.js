const conn= require('../../DB')

//function that getting the all variets from db by productId 
exports.getVariets = (req,res)=>{
   
    const sql=` SELECT products.ID, variations.ID AS varietsID,variations.varietsName,variations.value,variations.color,images.Filename,variets_product.Price ,variets_product.ID AS variID 
    FROM products 
    INNER JOIN variets_product ON variets_product.productID = products.ID
    INNER JOIN variations ON variets_product.varitsID = variations.ID 
    LEFT JOIN images ON variets_product.ImgID=images.ID where products.ID=${req.body.productID}`;
 
    conn.query(sql,(error,results,fields)=>{
        if(error) throw error;
        
        res.send(results);
      })
    };
    exports.list = async(req,res) =>{
      try {
        
          const sql ='SELECT varietsName,ID AS variID,value,color FROM variations ORDER BY varietsName';
          
          conn.query(sql,function (error, results, fields) {
  
         
            res.send(results);
    
        });
        } catch (err) {
         
          res.status(400).send("Getting The Variets Failed");
        }
  }
    exports.create = async(req,res) => {
   
      try {
        const { name ,value,chk} = req.body;
        console.log(chk)
        const sql=`SELECT * FROM variations WHERE varietsName="${name}" AND value="${value}"` ;
        conn.query(sql,function (error, results, fields) {
          if (error ) throw error
         if(results.length>0) 
         res.status(400).send(" There is the same Variet ");
         else {
          const sql =`INSERT INTO variations(	varietsName,value,color) VALUES ("${name}","${value}",${chk})`
          conn.query(sql,function (error, results, fields) {
            if (error && error.errno==1062) return res.status(400).json({error : "Variet already exists"})
         
            res.send(results);
    
        }); 
         }
  
      });

      } catch (err) {
       
        res.status(400).send("Create Variet failed");
      }
}
exports.update = async(req,res) => {
 
  try {
    const { name ,value,chk,variId} = req.body;
    console.log(variId)
    const sql =`UPDATE variations SET varietsName ="${name}",value="${value}" value=${chk} WHERE ID = ${variId}`

    conn.query(sql,function (error, results, fields) {
      if (error) throw error;
   
      res.send(results);

  });
  } catch (err) {
     console.log(err);
    res.status(400).send("Update Variet failed");
  }
}
exports.remove = async(req,res) => {

  try {
  
    const{ variId}= req.body; 
    const sql =`DELETE FROM variations WHERE ID =${variId}`;
    conn.query(sql,function (error, results, fields) {
      if (error) throw error;
   
      res.send(results);

  });
  } catch (err) {
    console.log(err);
    res.status(400).send("Delete Variets failed");
  }
}
exports.removeTitle = async(req,res) => {

  try {
  
    const{ name}= req.body; 
    const sql =`DELETE FROM variations WHERE varietsName ="${name}"`;
    conn.query(sql,function (error, results, fields) {
      if (error) throw error;
   
      res.send(results);

  });
  } catch (err) {
  
    res.status(400).send("Delete Variets failed");
  }
}
exports.updateTitle = async(req,res) => {
 
  try {
    const { newTitle,title } = req.body;
   
    const sql =`UPDATE variations SET varietsName ="${newTitle}" WHERE  varietsName = "${title}"`

    conn.query(sql,function (error, results, fields) {
      if (error) throw error;
   
      res.send(results);

  });
  } catch (err) {
     console.log(err);
    res.status(400).send("Update Variet failed");
  }
}
