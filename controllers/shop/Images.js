const conn= require('../../DB')
const fs = require("fs");

//function that getting the all images from db 
exports.getImages=(req,res)=>{
    const sql ='SELECT * FROM images'
    conn.query(sql,(error,results,fields)=>{
      if(error) throw error;
      res.send(results);
    })
  };
 
    
    exports.uploadimages= async (req, res) => {
      
      const base64Data = req.body.image.replace(/^data:image\/jpeg;base64,/,"");
      
      const buffer = Buffer.from( base64Data, "base64");
      const name=`${Date.now()}.jpeg`
      const url =`./public/uploads/${name}`
      fs.writeFileSync(`${url}`, buffer);
      
      return res.json(`/${name}`)   
    }
    exports.removeimages= async (req, res) => {
   
   fs.stat(`./public/uploads/${url}`, function (err, stats) {
        console.log('stats',stats);//here we got all information of file in stats variable
        if(stats.isFile())
        fs.unlinkSync(`./public/uploads/${url}`,function(err){
             if(err) return console.log(err);
             console.log('file deleted successfully');
        });  
     });
     res.json("removed") 
    }
    
    
    
 