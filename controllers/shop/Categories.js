const conn= require('../../DB')
//function that getting the all categories from db 
exports.getCategories = (req,res) => {
    let sql='SELECT * FROM categories';
    
    conn.query(sql,function (error, results, fields) {
        if (error) throw error;
     
        res.send(results);

    });
}
exports.getCategory = (req,res) => {
 
    let sql=`SELECT * FROM categories WHERE ID=${req.params.catID}`;
  
    conn.query(sql,function (error, results, fields) {
        if (error) throw error;
     
        res.send(results);
  
    });

 
}

exports.create = async(req,res) => {
   
        try {
          const { name } = req.body;
          const sql =`INSERT INTO categories( Name) VALUES ("${name}")`
          conn.query(sql,function (error, results, fields) {
            if (error && error.errno==1062) return res.status(400).json({error : "Category already exists"})
         
            res.send(results);
    
        });
        } catch (err) {
         
          res.status(400).send("Create category failed");
        }
}
exports.update = async(req,res) => {
   
    try {
      const { name ,catId} = req.body;

      const sql =`UPDATE categories SET name ="${name}" WHERE ID = ${catId}`
     
      conn.query(sql,function (error, results, fields) {
        if (error && error.errno==1062) return res.status(400).json({error : "Category already exists"})
     
        res.send(results);

    });
    } catch (err) {
       console.log(err);
      res.status(400).send("Create category failed");
    }
}
exports.remove = async(req,res) => {
 
    try {
    
      const{ catId}= req.body; 
      const sql =`DELETE FROM categories WHERE ID = ${ catId}`
      conn.query(sql,function (error, results, fields) {
        if (error) throw error;
     
        res.send(results);

    });
    } catch (err) {
      console.log(err);
      res.status(400).send("Delete category failed");
    }
}