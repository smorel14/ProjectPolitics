const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const nodemailer = require('nodemailer');

//const Articles = require("../models/Articles");
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth:{
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
})




router.get("/login", (req, res, next) => {
  //res.render("auth/login", { "message": req.flash("error"),   layout: "layout-without-navbar" });
  res.render("auth/login", { 
    "message": req.flash("error"), 
    title:"Login",        
    message: req.query.errorMessage
});
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true,
}));

router.get("/signup", (req, res, next) => {
  res.render("auth/signup", { title: "Signup" });
});


router.post("/signup", (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const role = req.body.role
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length )];
  }

  if (email === "" || password === "" || role === "") {
    res.render("auth/signup", { message: "Indicate email and password"});
    return;
  }
  User.findOne({ email }, "email", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The email already exists" });
      return;
    }
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const newUser = new User({
      email,
      password: hashPass,
      role,
      name: email,
      confirmation_code: token
    });
    newUser.save()
    //onsole.log('newUser2', newUser)
    .then(() =>{
      transporter.sendMail({
        from: "Goverment",
        to: email,
        subject: "Political Transformation",
        text: `use the following link: ${process.env.BASE_URL}/auth/newlogin/${token}`,
        html: `Please click on the following link to create your account: <br> ${process.env.BASE_URL}/auth/newlogin/${token} <br>`
      })
      .then(() => {
        res.redirect("/?errorMessage= You have been send a confirmation email, to log in click on the email link that we sent you.");
      })
      .catch(next)
    })
    .catch(err => {
      console.log('error', err)
      res.render("auth/signup", { message: "Something went wrong" });
    })
  });
});




router.get("/newlogin/:confirmationCode", (req,res,next) => {
  // Find the user with the confirmationCode and update the status to "confirmed"
  // When it's done, req.login(theUserToLogin, () => { res.redirect("/......") })

  let sentVerification = req.params.confirmationCode
  console.log(sentVerification)
  User.find({confirmation_code : sentVerification}).then((user) => {
    
    console.log('confirmation code', user[0].confirmation_code )
    console.log('sentVerification',sentVerification )
    if(user[0].confirmation_code === sentVerification){
      console.log('user.id', user[0].id)
      User.findByIdAndUpdate(user[0].id, {status: "confirmed"}).then((updatedUser)=>{
          console.log(updatedUser);
          req.login(updatedUser, () => {
            console.log('here we are')
            res.redirect('/');
          })
          //passport.authenticate('local')(req, res, function () {
       // })
      })
      .catch(err =>{
        res.render("auth/login", { message: "You have an error" });
      })
    }
    else {
      res.render("auth/login", { message: "You have the wrong verification code" });
    }
    })
    .catch(err =>{
      res.render("auth/login", { message: "You have an error" });
    })
  })



//   console.log('sentVerification', sentVerification);
//   let userVerification = req.user.confirmation_code;
//   console.log('userVerification', req.user);
//   console.log('userVerification', userVerification);
//   if (sentVerification === userVerification){
//     User.findByIdAndUpdate(req.user.id, {status: "confirmed"}).then(()=>{
//       res.redirect("/");
//     })
//     .catch(err =>{
//       res.render("auth/login", { message: "Something went wrong" });
//     })
//   }
//   else{
//     res.render("auth/login", { message: "You have the wrong verification code" });
//   }
// })




router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});




module.exports = router;
