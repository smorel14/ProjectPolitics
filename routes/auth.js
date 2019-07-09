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
  res.render("auth/login", { "message": req.flash("error"), title:"Login"});
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
    console.log('i am here', email, hashPass, role, email, token)
    const newUser = new User({
      email,
      password: hashPass,
      role,
      name: email,
      confirmation_code: token
    });
    console.log('newUser', newUser)
    console.log('i am here 2', email, hashPass, role, email, token)
    newUser.save()
    //onsole.log('newUser2', newUser)
    .then(() =>{
      console.log('i am here 3')
      transporter.sendMail({
        from: "Goverment",
        to: email,
        subject: "Political Transformation",
        text: 'use the following link: ' + token,
        html: '<br>'+ token +'<br>'
      })
      .then(() => {
        res.redirect("/");
      })
      .catch(next)
    })
    .catch(err => {
      console.log('error', err)
      res.render("auth/signup", { message: "Something went wrong" });
    })
  });
});





router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});




module.exports = router;
