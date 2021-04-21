const conn= require('../../DB')

exports.getCart = (req,res) => {
   
    const id = req.auth.id;
    let sql=`SELECT Items FROM cart WHERE userID = ${id}`;
 
    conn.query(sql,function (error, results, fields) {
        if (error) throw error;
  
        return res.status(200).send(results[0])
      
    });
   
}
exports.updateCart = async (req,res) => {
    try {
    const id =  parseInt(req.auth.id);
  
    const cart=req.body.cart;
    let cartFinal=cart.replace(/'/g, "''")
    cartFinal=JSON.stringify(cartFinal)
    let sql=`SELECT * FROM cart WHERE userID = ${id} `;
    
     conn.query(sql,function (error, results, fields) {
        if (error) throw error;
     
       if(results.length==0)
       {
        sql=`INSERT INTO cart(Items,userID) VALUES ('${cartFinal}',${id})  `;
        conn.query(sql,function (error, results, fields) {
            if (error) throw error;
            return res.status(200).send('sucsses')
        })
       }
       else {
           sql =`UPDATE cart SET Items='${cartFinal}' WHERE userID = ${id} `
           conn.query(sql,function (error, results, fields) {
            if (error) throw error;
            return res.status(200).send('sucsses')
            
        })
       }

    });
} 
catch (err) {
    console.log(err);
    res.status(400).send(" failed");
}
}
exports.emptyCart=async(req,res)=>{
    const id =  req.auth.id;
   let sql =` DELETE FROM cart WHERE userID=${id}`;
   conn.query(sql,function (error, results, fields) {
    if (error) throw error;
    return res.status(200).send('cart empty')
})

    
}

