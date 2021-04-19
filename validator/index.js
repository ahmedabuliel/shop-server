exports.userSignupValidator = (user) =>{


    let error={
        err:false
    }
  let valiphone= user.phone.match(/^\d+$/) 
  let valipassword= user.password.match(/\d/) 
  let valiemail=user.email.match(/.+\@.+\..+/gm)
  let string = user.name.match(/^[a-zA-Z]{1,}(?: [a-zA-Z]+){0,2}$/gm)
    if(user.name==''){
        error['err']=true;
         errorMsg='Name is required';
         return error;
  }
  if(!string){
    error['err']=true;
   error['errorMsg']='Name must contain just letters'
   return error;
  }
  if(user.email.length<6 &&user.email.length>100){
    error['err']=true;
   error['errorMsg']='Email must be between 6 to 100 characters'
   return error;
  }
  if(!valiemail)
  {
     
     return error['errorMsg']='Email must contain @' ;
  }
  if(user.password==''){
    error['err']=true;
    error['errorMsg']='Password is requierd';
    return error;
  }
  if(user.password.length<6){
    return error['errorMsg']='Password must contain at least 6 characters';
  }
  if(!valipassword){
    error['err']=true;
    error['errorMsg']='Password must contain a number'
    return error
  }
  if(user.phone=='')
  {      
      error['err']=true;
         error['errorMsg']='Phone is required' 
         return error
  }
  if(!valiphone)
  {  error['err']=true;
     error['errorMsg']="Phone must contain just a number";
     return error
  }
  if(user.phone.length<9 &&user.phone.length>10)
  {        error['err']=true
            error['errorMsg']="Phone Number must been 9 or 10 numbers"
            return error
  }
  return error;  
   
}
exports.userSigninValidator = (req,res,next) =>{
   
    req.check('email', 'Email must be between 6 to 100 characters').matches(/.+\@.+\..+/).withMessage("Email must contain @").isLength({min:6, max:100})
    req.check('password','Password is requierd').notEmpty()
    req.check('password').isLength({min:6}).withMessage('Password must contain at least 6 characters').matches(/\d/).withMessage("Password must contain a number")


    const errors = req.validationErrors()
    if (errors){
        const firstError = errors.map(error => error.msg)[0]
        return res.status(400).json({error:firstError})
    }
    next()
}