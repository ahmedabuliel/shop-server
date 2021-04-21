exports.userSignupValidator = (req,res,next) =>{
  req.check('name','Name is required').notEmpty()
  req.check('email', 'Email must be between 6 to 100 characters').matches(/.+\@.+\..+/).withMessage("Email must contain @").isLength({min:6, max:100})
  req.check('password','Password is requierd').notEmpty()
  req.check('password').isLength({min:6}).withMessage('Password must contain at least 6 characters').matches(/\d/).withMessage("Password must contain a number")
  req.check('phone','Phone is requierd').notEmpty()
  req.check('phone', 'Phone must be between 9 to 10 characters').matches(/^\d+$/).withMessage("Phone must contain just numbers").isLength({min:9, max:10})
  if(req.body.profile){
  req.check('profile', 'Please choose just gif | jpg | jpeg | png files').matches(/\.(gif|jpe?g|tiff?|png|webp|bmp)$/).withMessage("Please choose just gif|jpg|jpeg|png files")
  }
  const errors = req.validationErrors()
  if (errors){
      
      const firstError = errors.map(error => error.msg)[0]
      
      return res.status(402).json({error:firstError})
  }

  next()
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