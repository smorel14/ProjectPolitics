const express = require("express");
const router = express.Router();
const Article = require("../models/Article");
const uploadCload = require("../congfig/cloudinary");
const User = require("../models/User");
const Vote = require("../models/Vote");

router.get("/", (req, res, next) => {
  Article.find().then(articlesFromDb => {
    res.render("index", {
      articles: articlesFromDb,
      title: "News"
    });
  });
});

router.get("/addArticle", (req, res, next) => {
  console.log("we are here");
  res.render("addArticle");
});

router.post("/addArticle", uploadCload.single("photo"), (req, res, next) => {
  const { title, description, link, date, votingDate } = req.body;
  const imgArticle = req.file.url;
  Article.create({ title, description, link, date, votingDate, imgArticle })
    .then(articles => {
      res.redirect("/");
    })
    .catch(error => {
      console.log(error);
    });
});

router.get("/editProfile", (req, res, next) => {
  res.render("edit-profile");
});

router.post("/editProfile", uploadCload.single("photo"), (req, res, next) => {
  let id = req.user.id;
  let imgArticle = "";
  if (req.file) {
    imgArticle = req.file.url;
  } else {
    imgArticle = req.user.profilePicture;
  }
  User.findByIdAndUpdate(id, {
    name: req.body.name,
    politicalView: req.body.politicalView,
    party: req.body.party,
    profilePicture: imgArticle
  }).then(() => {
    res.redirect("/");
  });
});

router.get("/voting/:articlesId", (req, res, next) => {
  let articlesId = req.params.articlesId;
  Article.findById(articlesId).then(articleFromDb => {
    res.render("voting", {
      article: articleFromDb
    });
  });
});




router.post("/voting/:articlesId", (req, res, next) => {
  console.log("WHAT ARE MY paramss", req.params)

  console.log("i am here", req.body)
  let _owner = req.user.id
  let option = req.body.select1
  let visible = req.body.select2
  let _article = req.params.articlesId;
  console.log("EXEEEEERIOOOOONE", _owner, _article, option, visible)
  Vote.create({ _owner, _article, option, visible })
  .then(()=> {
    res.redirect("/")
  })
})

 

router.get("/profile/:userId", (req, res, next) => {
  let userId = req.params.userId;
  User.findById(userId).then(userFromDb => {
    res.render("profile", {
      user: userFromDb
    });
  });
});

// router.post('/profile', (req, res, next) => {
//   let userId = req.params.userId
//   let imgUser = req.user.profilePicture
//   User.findById(userId)
//     .then(userFromDb => {
//       res.render('profile', {
//         user : userFromDb,
//         // profilePicture: imgUser,
//       })
//     })
// })

module.exports = router;
