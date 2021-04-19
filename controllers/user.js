const conn= require('../DB')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
const bcrypt = require('bcrypt'); 
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const {userSignupValidator} = require('../validator');
var nodemailer = require('nodemailer');





exports.userById = (req,res,next,id) =>{
    let sql=`SELECT * FROM users WHERE ID=${id}`
    conn.query(sql,function (error, user, fields) {
        if (error|| user.length==0){

            return res.status(400).json({error:"User not found"})
        }
       
        req.user = user;
        next()
    })
}


exports.signup = async (req,res) => {
   
  
       let form = new formidable.IncomingForm();
       form.keepExtensions = true;
       let profile_image='';
       form.uploadDir='./public/uploads'
       form.parse(req, async (err, fields, files) => { 
           if (files.imgFile) {
               if (files.imgFile.size > 1000000) {
                 return res.status(400).json({
                   error: 'Image should be less than 1mb in size'
                 });
               }
              const temp=files.imgFile.path.split("\\");
               profile_image='/'+temp[2];
            
               
            }
       const valid= userSignupValidator(fields)
       if(valid.err===true){
        res.status(400).json({
            error:valid.errorMsg
          });
       }
        
            const user=fields;
            user['role']=0
            user['profile_image']= profile_image;
            const hashed_password=   await bcrypt.hash(user.password,10)
            const sql =`INSERT INTO users(  name, phone, email, password,profile_image,role) VALUES ("${user.name}",${user.phone},"${user.email}","${hashed_password}","${user.profile_image}",0)`
            conn.query(sql,function (error, results, fields) {
                if (error && error.errno==1062) return res.status(400).json({error : "Email already exists"})
                if(results.insertId){   
                const token = jwt.sign({id:results.insertId}, process.env.JWT_SECRET)
                res.cookie("t", token, {expire: new Date() + 9999})
                const {ID, username,name, role, email} = user;
              
                return res.json({token, user:{ID, username,name, email,profile_image, role}})   
                }
            })    
        
        })
     
   
  

} 

exports.signin = async (req,res) => {
        
        const {email, password} = req.body;
        let sql=`SELECT ID,name,password, phone, email, profile_image,role FROM users WHERE email = "${email}" `;
        
        conn.query(sql,function (error, results, fields) {
            if(error){res.status(400).send(error)}
            else if(results.length==0){
                return res.status(400).json({ err: "Email or Password do not match"})
            }
            else{ 
                bcrypt.compare(password, results[0].password).then(function(match) {
                if(match){
                  
                    const token = jwt.sign({id:results[0].ID}, process.env.JWT_SECRET)
                    res.cookie("t", token, {expire: new Date() + 9999})
                    const {ID, name, role, email,profile_image} = results[0];
                    return res.json({token, user:{ID, name, email, role,profile_image}})}
                else  return res.status(400).json({ error: "Email or Password do not match"})
                });
                }
            
    })
  
  
}

exports.signout = (req,res) => {
        res.clearCookie("t")
        res.json({message:"signout success"})
    }

exports.requireSignin = expressJwt({
    secret:process.env.JWT_SECRET,
    algorithms:["HS256"],
    userProperty:"auth",
 
})



exports.isAdmin = (req,res,next) => {
    const id = req.auth.id;
   
    let sql=`SELECT ID,name,password, phone, email, profile_image,role FROM users WHERE ID = "${id}" `;
    conn.query(sql,function (error, results, fields) {
        if(results[0].role==0){
            return res.status(403).json({
                err:"Admin resource! Access denied"
            })
        }
    })
    next()
} 

exports.auth = (req,res) => {
  
    const id = req.auth.id;
  
    let sql =`SELECT name ,phone, email, profile_image,role FROM users WHERE ID = "${id}"`;
    conn.query(sql,function (error, results, fields) {
        if (error || results.length==0) return res.status(400).json({error : "User Not Found"})
      const{name,phone,email,profile_image,role} =results[0];
        return res.status(200).json({id,name,phone,email,profile_image,role})
    })
   
  
}

exports.getoldProfileImg=async(req,res,next)=>{
    const id = req.auth.id;
    let form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => { 
        if (files.imgFile) {
    let sql =`SELECT  profile_image FROM users WHERE ID = ${id}`;
    conn.query(sql,function (error, results, fields) {
        if (error) throw error;
        if(results.length!=0){
        let oldProfileImg=results[0].profile_image
        fs.stat(`./public/uploads/${oldProfileImg}`, function (err, stats) {
            console.log('stats',stats);//here we got all information of file in stats variable
            if(stats.isFile())
            fs.unlinkSync(`./public/uploads/${oldProfileImg}`,function(err){
                 if(err) return console.log(err);
                 console.log('file deleted successfully');
            });  
         });
        }   
    })
    }
})
    next()
}
exports.updateProfile = async(req,res)=>{
  
    let form = new formidable.IncomingForm();
       form.keepExtensions = true;
       let profile_image='';
       form.uploadDir='./public/uploads'
       form.parse(req, async (err, fields, files) => { 
        const user=fields;  
        
     
        if (files.imgFile) {
               if (files.imgFile.size > 1000000) {
                 return res.status(400).json({
                   error: 'Image should be less than 1mb in size'
                 });
               }
              const temp=files.imgFile.path.split("\\");
               profile_image='/'+temp[2];
          
            }
       const valid= userSignupValidator(fields)
       if(valid.err===true){
        res.status(400).json({
            error:valid.errorMsg
          });
       }
        
           
            const hashed_password=   await bcrypt.hash(user.password,10)
            sql =`UPDATE users SET name="${user.name}",phone="${user.phone}",email="${user.email}",password="${hashed_password}",role=0 WHERE ID = ${user.ID}`
            if (profile_image!='')   {
                
                sql =`UPDATE users SET name="${user.name}",phone="${user.phone}",email="${user.email}",password="${hashed_password}",profile_image="${profile_image}",role=0 WHERE ID = ${user.ID}`
            }

          
            conn.query(sql,function (error, results, fields) {
    
                return res.send('profile updated ')   
                
            })   
        })
} 

exports.updateAddress = (req,res)=>{
    const id = req.auth.id;
    const {address}=req.body
    let sql=`UPDATE users SET  Address ="${address}" WHERE ID = ${id}`
    conn.query(sql,function (error, results, fields) {
        if(error){res.status(400).send(error)}
        else return res.json({msg:'Address Saved ',status:'ok'})   
        
    })   
}
exports.getAddress = (req,res)=>{
    const id = req.auth.id;
   
    let sql=`SELECT Address FROM users  WHERE ID = ${id}`
    conn.query(sql,function (error, results, fields) {
        if(error){res.status(400).send(error)}
        else return res.send(results[0])   
        
    })   
}
exports.frogetPassword=(req,res)=>{
   const {email}=req.body
    let sql =`SELECT ID from users WHERE email='${email}' `;
    console.log(sql)
    conn.query(sql,function (error, results, fields) {
        if(error){res.status(400).send(error)}
        else if(results.length>0){
        const token =  jwt.sign({id:results[0].ID}, process.env.JWT_SECRET);
        res.cookie("t", token, {expire: new Date() + 9999})
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USER_NAME,
              pass: process.env.EMAIL_PASSWORD
            }
            
          });
          var mailOptions = {
            from: process.env.EMAIL_USER_NAME,
            to: email,
            subject: 'Link to restart Your Password',
           html: `<h1>Reset Password</h1><br/><p>Because you requested to reset your password, please follow the link below</p>
                <br/><a href='http://localhost:3000/updatepassword/${token}'>Reset Password</a>`
          };
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
             res.send(error);
            } else {
             res.send('Email sent');
            }
          });
        }
        else res.send('Email Not Exist')
    })
}
exports.updatePassword=async (req,res)=>{
    const id = req.auth.id;
    
    const {password}=req.body
    const hashed_password=   await bcrypt.hash(password,10)
    let sql = `UPDATE users SET password ="${hashed_password}" WHERE ID=${id}`;
    conn.query(sql,function (error, results, fields) {
        if(error){res.status(400).send(error)}
    else 
    sql= `SELECT ID,name, phone, email, profile_image,role FROM users WHERE ID = "${id}" AND password="${hashed_password}" `
    conn.query(sql,function (error, results, fields) {
        if(error){res.status(400).send(error)}
        else {
            const token = jwt.sign({id:results[0].ID}, process.env.JWT_SECRET)
            res.cookie("t", token, {expire: new Date() + 9999})
            const {ID, name, role, email,profile_image} = results[0];
         return res.json({token, user:{ID, name, email, role,profile_image}})
        }
    })
})
}